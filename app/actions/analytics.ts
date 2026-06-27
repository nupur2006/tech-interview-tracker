import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import { format, subMonths, startOfMonth, eachMonthOfInterval } from "date-fns";

export interface AnalyticsData {
  totalApplications: number;
  interviewRate: number; // percentage
  offerRate: number; // percentage
  statusBreakdown: { name: string; value: number; fill?: string }[];
  funnelData: { name: string; value: number }[];
  applicationsOverTime: { name: string; count: number }[];
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  BOOKMARKED: "#94a3b8", // slate-400
  APPLIED: "#60a5fa", // blue-400
  OA: "#c084fc", // purple-400
  PHONE_SCREEN: "#818cf8", // indigo-400
  TECHNICAL: "#f472b6", // pink-400
  ONSITE: "#fb923c", // orange-400
  OFFER: "#4ade80", // green-400
  REJECTED: "#f87171", // red-400
  WITHDRAWN: "#a8a29e", // stone-400
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // 1. Total Applications
  const totalApplications = await prisma.application.count({
    where: { userId },
  });

  if (totalApplications === 0) {
    return {
      totalApplications: 0,
      interviewRate: 0,
      offerRate: 0,
      statusBreakdown: [],
      funnelData: [],
      applicationsOverTime: [],
    };
  }

  // 2. Applications with Interviews
  const applicationsWithInterviews = await prisma.application.count({
    where: {
      userId,
      interviews: {
        some: {},
      },
    },
  });

  const interviewRate = Math.round((applicationsWithInterviews / totalApplications) * 100);

  // 3. Offers
  const offers = await prisma.application.count({
    where: {
      userId,
      status: ApplicationStatus.OFFER,
    },
  });

  const offerRate = Math.round((offers / totalApplications) * 100);

  // 4. Status Breakdown
  const statusCounts = await prisma.application.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { userId },
  });

  const statusBreakdown = statusCounts.map((item) => ({
    name: item.status.replace(/_/g, " "),
    value: item._count.id,
    fill: STATUS_COLORS[item.status],
  })).sort((a, b) => b.value - a.value);

  // 5. Funnel Data
  // To create a funnel, we look at the progress of applications. 
  // We'll approximate this by counting how many apps reached AT LEAST each stage.
  // Stage hierarchy approx: Applied -> Screen/OA -> Tech/Onsite -> Offer
  const allApps = await prisma.application.findMany({
    where: { userId },
    select: { status: true },
  });

  let reachedApplied = 0;
  let reachedScreen = 0;
  let reachedTech = 0;
  let reachedOffer = 0;

  allApps.forEach((app) => {
    // Everyone except BOOKMARKED counts as applied
    if (app.status !== ApplicationStatus.BOOKMARKED) reachedApplied++;
    
    if (([ApplicationStatus.OA, ApplicationStatus.PHONE_SCREEN, ApplicationStatus.TECHNICAL, ApplicationStatus.ONSITE, ApplicationStatus.OFFER] as ApplicationStatus[]).includes(app.status)) {
      reachedScreen++;
    }
    
    if (([ApplicationStatus.TECHNICAL, ApplicationStatus.ONSITE, ApplicationStatus.OFFER] as ApplicationStatus[]).includes(app.status)) {
      reachedTech++;
    }
    
    if (app.status === ApplicationStatus.OFFER) {
      reachedOffer++;
    }
  });

  const funnelData = [
    { name: "Applied", value: reachedApplied },
    { name: "Screening", value: reachedScreen },
    { name: "Technical", value: reachedTech },
    { name: "Offer", value: reachedOffer },
  ];

  // 6. Applications Over Time (Last 6 Months)
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
  
  const appsOverTime = await prisma.application.findMany({
    where: {
      userId,
      appliedDate: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      appliedDate: true,
    },
  });

  const monthsInterval = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: new Date(),
  });

  // Initialize all months with 0
  const monthlyCounts = monthsInterval.reduce((acc, month) => {
    const monthStr = format(month, "MMM yyyy");
    acc[monthStr] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Populate counts
  appsOverTime.forEach((app) => {
    if (app.appliedDate) {
      const monthStr = format(new Date(app.appliedDate as Date), "MMM yyyy");
      if (monthlyCounts[monthStr] !== undefined) {
        monthlyCounts[monthStr]++;
      }
    }
  });

  const applicationsOverTime = Object.entries(monthlyCounts).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    totalApplications,
    interviewRate,
    offerRate,
    statusBreakdown,
    funnelData,
    applicationsOverTime,
  };
}
