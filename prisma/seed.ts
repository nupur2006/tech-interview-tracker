// ─────────────────────────────────────────────────────────────────────────────
// Seed — Tech Interview Timeline Tracker
// Populates the database with 10 realistic sample applications
// ─────────────────────────────────────────────────────────────────────────────

import {
  PrismaClient,
  ApplicationStatus,
  TimelineEventType,
  InterviewType,
  InterviewOutcome,
  ReminderType,
} from "@prisma/client";

const prisma = new PrismaClient();

// ── Helper ──────────────────────────────────────────────────────────────────

/** Returns a Date offset by `days` from today (negative = past). */
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d;
}

// ── Main seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database…\n");

  // ── 1. Create a demo user ─────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: "demo@techtracker.dev" },
    update: {},
    create: {
      email: "demo@techtracker.dev",
      name: "Alex Rivera",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ User: ${user.name} (${user.email})`);

  // ── 2. Create companies ───────────────────────────────────────────────────
  const companiesData = [
    { name: "Google",     website: "https://google.com",     industry: "Technology",       size: "10000+", logo: "https://logo.clearbit.com/google.com" },
    { name: "Stripe",     website: "https://stripe.com",     industry: "Fintech",          size: "1001-5000", logo: "https://logo.clearbit.com/stripe.com" },
    { name: "Vercel",     website: "https://vercel.com",     industry: "Developer Tools",  size: "201-1000", logo: "https://logo.clearbit.com/vercel.com" },
    { name: "Notion",     website: "https://notion.so",      industry: "Productivity",     size: "201-1000", logo: "https://logo.clearbit.com/notion.so" },
    { name: "Datadog",    website: "https://datadoghq.com",  industry: "Observability",    size: "5001-10000", logo: "https://logo.clearbit.com/datadoghq.com" },
    { name: "Figma",      website: "https://figma.com",      industry: "Design Tools",     size: "1001-5000", logo: "https://logo.clearbit.com/figma.com" },
    { name: "Airbnb",     website: "https://airbnb.com",     industry: "Travel & Hospitality", size: "5001-10000", logo: "https://logo.clearbit.com/airbnb.com" },
    { name: "Shopify",    website: "https://shopify.com",    industry: "E-commerce",       size: "10000+", logo: "https://logo.clearbit.com/shopify.com" },
    { name: "Linear",     website: "https://linear.app",     industry: "Developer Tools",  size: "51-200", logo: "https://logo.clearbit.com/linear.app" },
    { name: "Confluent",  website: "https://confluent.io",   industry: "Data Infrastructure", size: "1001-5000", logo: "https://logo.clearbit.com/confluent.io" },
  ];

  const companies: Record<string, string> = {};
  for (const c of companiesData) {
    const company = await prisma.company.upsert({
      where: { userId_name: { userId: user.id, name: c.name } },
      update: {},
      create: { ...c, userId: user.id },
    });
    companies[c.name] = company.id;
  }
  console.log(`✅ Companies: ${Object.keys(companies).length} created`);

  // ── 3. Create applications across various stages ──────────────────────────

  // ─── Application 1: Google — deep in process (ONSITE) ─────────────────────
  const app1 = await prisma.application.create({
    data: {
      role: "Senior Software Engineer, Cloud AI",
      location: "Mountain View, CA",
      status: ApplicationStatus.ONSITE,
      appliedDate: daysAgo(45),
      jobUrl: "https://careers.google.com/jobs/results/12345",
      notes: "Referral from college friend Priya. L5 target level. Team works on Vertex AI platform.",
      salaryMin: 220000,
      salaryMax: 310000,
      source: "Referral",
      userId: user.id,
      companyId: companies["Google"]!,
    },
  });

  await prisma.contact.createMany({
    data: [
      { name: "Priya Sharma", email: "priya.s@google.com", linkedIn: "https://linkedin.com/in/priyasharma", role: "Staff Engineer", relationship: "Referral", applicationId: app1.id },
      { name: "David Chen", email: "david.chen@google.com", role: "Technical Recruiter", relationship: "Recruiter", applicationId: app1.id },
    ],
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,      date: daysAgo(45), title: "Submitted referral application",       description: "Priya submitted internal referral. Applied to Cloud AI team.", applicationId: app1.id },
      { type: TimelineEventType.EMAIL,      date: daysAgo(40), title: "Recruiter intro email",               description: "David Chen reached out to schedule initial call.",              applicationId: app1.id },
      { type: TimelineEventType.CALL,       date: daysAgo(35), title: "Recruiter phone screen",              description: "30 min call. Discussed background, team, timeline.",           applicationId: app1.id },
      { type: TimelineEventType.OA,         date: daysAgo(28), title: "Online coding assessment",            description: "2 problems on Google's internal platform. 90 minutes.",        applicationId: app1.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(14), title: "Phone technical interview",           description: "45 min DSA round. Graph traversal + system design warmup.",    applicationId: app1.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(3),  title: "Onsite interviews (virtual loop)",    description: "4 rounds: 2 coding, 1 system design, 1 behavioral.",          applicationId: app1.id },
    ],
  });

  await prisma.interview.createMany({
    data: [
      { round: 1, type: InterviewType.PHONE,     scheduledAt: daysAgo(14), durationMinutes: 45,  location: "Google Meet", interviewerName: "Mei Lin",      interviewerRole: "Senior SWE",    outcome: InterviewOutcome.PASSED,  notes: "Graph BFS problem + short system design discussion.",      applicationId: app1.id },
      { round: 2, type: InterviewType.ONSITE,     scheduledAt: daysAgo(3),  durationMinutes: 240, location: "Google Meet", interviewerName: "Panel",        interviewerRole: "Hiring Committee", outcome: InterviewOutcome.PENDING, notes: "Virtual onsite. 4 back-to-back rounds.",                   applicationId: app1.id },
    ],
  });

  await prisma.reminder.create({
    data: { title: "Follow up with David on onsite results", dueDate: daysFromNow(2), type: ReminderType.FOLLOW_UP, userId: user.id, applicationId: app1.id },
  });

  // ─── Application 2: Stripe — OFFER stage ─────────────────────────────────
  const app2 = await prisma.application.create({
    data: {
      role: "Backend Engineer, Payments",
      location: "San Francisco, CA (Hybrid)",
      status: ApplicationStatus.OFFER,
      appliedDate: daysAgo(60),
      jobUrl: "https://stripe.com/jobs/listing/backend-engineer",
      notes: "Offer received! $245K base + equity. Need to respond by end of week.",
      salaryMin: 200000,
      salaryMax: 280000,
      source: "LinkedIn",
      userId: user.id,
      companyId: companies["Stripe"]!,
    },
  });

  await prisma.contact.create({
    data: { name: "Sarah Kim", email: "skim@stripe.com", role: "Engineering Manager", relationship: "Hiring Manager", applicationId: app2.id },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,      date: daysAgo(60), title: "Applied via LinkedIn",                  description: "Saw posting, applied directly.",                              applicationId: app2.id },
      { type: TimelineEventType.CALL,       date: daysAgo(52), title: "Recruiter screen",                     description: "Standard recruiter call, 30 min.",                            applicationId: app2.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(40), title: "Technical phone screen",               description: "Coding problem: design a rate limiter.",                      applicationId: app2.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(25), title: "Virtual onsite — 3 rounds",            description: "System design, coding, cross-functional.",                    applicationId: app2.id },
      { type: TimelineEventType.OFFER,      date: daysAgo(5),  title: "Offer received 🎉",                   description: "$245K base, $150K RSU/4yr, $50K signing bonus.",              applicationId: app2.id },
    ],
  });

  await prisma.interview.createMany({
    data: [
      { round: 1, type: InterviewType.PHONE,     scheduledAt: daysAgo(40), durationMinutes: 60, location: "Zoom",       interviewerName: "James Park",    interviewerRole: "Senior Engineer",  outcome: InterviewOutcome.PASSED, notes: "Rate limiter design. Clean implementation.",           applicationId: app2.id },
      { round: 2, type: InterviewType.VIDEO,      scheduledAt: daysAgo(25), durationMinutes: 180, location: "Zoom",      interviewerName: "Panel",         interviewerRole: "Various",          outcome: InterviewOutcome.PASSED, notes: "System design: payment processing pipeline.",          applicationId: app2.id },
    ],
  });

  await prisma.reminder.create({
    data: { title: "Respond to Stripe offer by Friday", dueDate: daysFromNow(3), type: ReminderType.DEADLINE, userId: user.id, applicationId: app2.id },
  });

  // ─── Application 3: Vercel — TECHNICAL interview ──────────────────────────
  const app3 = await prisma.application.create({
    data: {
      role: "Full Stack Engineer, DX",
      location: "Remote (US)",
      status: ApplicationStatus.TECHNICAL,
      appliedDate: daysAgo(30),
      jobUrl: "https://vercel.com/careers",
      notes: "Love the product. Team focuses on developer experience tooling (Turbopack, Next.js).",
      salaryMin: 180000,
      salaryMax: 250000,
      source: "Company Website",
      userId: user.id,
      companyId: companies["Vercel"]!,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,      date: daysAgo(30), title: "Applied on Vercel careers page",        description: "Tailored resume to highlight Next.js / React experience.",    applicationId: app3.id },
      { type: TimelineEventType.CALL,       date: daysAgo(22), title: "Initial recruiter chat",               description: "Quick 20-min call about the DX team and role.",               applicationId: app3.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(10), title: "Take-home coding challenge",           description: "Build a small CLI tool. 48h window. Submitted on time.",      applicationId: app3.id },
    ],
  });

  await prisma.interview.create({
    data: { round: 1, type: InterviewType.TECHNICAL, scheduledAt: daysFromNow(2), durationMinutes: 90, location: "Zoom", interviewerName: "Lee Robinson", interviewerRole: "VP of DX", outcome: InterviewOutcome.PENDING, notes: "Deep dive on take-home + live coding extension.", applicationId: app3.id },
  });

  await prisma.reminder.create({
    data: { title: "Prep for Vercel technical interview", dueDate: daysFromNow(1), type: ReminderType.INTERVIEW_PREP, userId: user.id, applicationId: app3.id },
  });

  // ─── Application 4: Notion — PHONE SCREEN ────────────────────────────────
  const app4 = await prisma.application.create({
    data: {
      role: "Software Engineer, Editor Platform",
      location: "New York, NY",
      status: ApplicationStatus.PHONE_SCREEN,
      appliedDate: daysAgo(18),
      jobUrl: "https://notion.so/careers",
      notes: "Interesting role working on the core editor. CRDT-based architecture.",
      salaryMin: 190000,
      salaryMax: 260000,
      source: "Hacker News",
      userId: user.id,
      companyId: companies["Notion"]!,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,  date: daysAgo(18), title: "Applied via HN Who's Hiring",              description: "Saw the post in June thread. Applied same day.",              applicationId: app4.id },
      { type: TimelineEventType.EMAIL, date: daysAgo(12), title: "Recruiter email received",                 description: "Scheduled phone screen for next week.",                       applicationId: app4.id },
    ],
  });

  await prisma.interview.create({
    data: { round: 1, type: InterviewType.PHONE, scheduledAt: daysFromNow(4), durationMinutes: 30, location: "Phone Call", interviewerName: "TBD", outcome: InterviewOutcome.PENDING, applicationId: app4.id },
  });

  // ─── Application 5: Datadog — OA stage ────────────────────────────────────
  const app5 = await prisma.application.create({
    data: {
      role: "Software Engineer, Observability Pipelines",
      location: "Boston, MA",
      status: ApplicationStatus.OA,
      appliedDate: daysAgo(14),
      jobUrl: "https://careers.datadoghq.com/detail/12345",
      notes: "Received online assessment link. Two coding problems + MCQs.",
      salaryMin: 175000,
      salaryMax: 240000,
      source: "LinkedIn",
      userId: user.id,
      companyId: companies["Datadog"]!,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE, date: daysAgo(14), title: "Applied on LinkedIn",                       description: "Easy apply. Attached custom resume.",                         applicationId: app5.id },
      { type: TimelineEventType.OA,   date: daysAgo(7),  title: "Online assessment received",                description: "HackerRank link. 90 min, 2 problems + 15 MCQs.",             applicationId: app5.id },
    ],
  });

  await prisma.reminder.create({
    data: { title: "Complete Datadog OA before deadline", dueDate: daysFromNow(1), type: ReminderType.DEADLINE, userId: user.id, applicationId: app5.id },
  });

  // ─── Application 6: Figma — APPLIED ──────────────────────────────────────
  const app6 = await prisma.application.create({
    data: {
      role: "Frontend Engineer, Canvas Rendering",
      location: "San Francisco, CA",
      status: ApplicationStatus.APPLIED,
      appliedDate: daysAgo(7),
      jobUrl: "https://www.figma.com/careers/",
      notes: "Applied through a friend's referral. WebGL experience is a plus.",
      salaryMin: 195000,
      salaryMax: 270000,
      source: "Referral",
      userId: user.id,
      companyId: companies["Figma"]!,
    },
  });

  await prisma.timelineEvent.create({
    data: { type: TimelineEventType.NOTE, date: daysAgo(7), title: "Application submitted via referral", description: "Friend works on the design systems team. Internal referral submitted.", applicationId: app6.id },
  });

  // ─── Application 7: Airbnb — REJECTED ────────────────────────────────────
  const app7 = await prisma.application.create({
    data: {
      role: "Staff Engineer, Search & Discovery",
      location: "San Francisco, CA",
      status: ApplicationStatus.REJECTED,
      appliedDate: daysAgo(50),
      jobUrl: "https://careers.airbnb.com",
      notes: "Rejected after onsite. Feedback: strong coding but system design didn't meet staff bar.",
      salaryMin: 280000,
      salaryMax: 380000,
      source: "Company Website",
      userId: user.id,
      companyId: companies["Airbnb"]!,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,      date: daysAgo(50), title: "Applied directly",                     description: "Targeted staff-level IC role.",                               applicationId: app7.id },
      { type: TimelineEventType.CALL,       date: daysAgo(42), title: "Recruiter screen",                     description: "30 min. Discussed staff expectations.",                       applicationId: app7.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(30), title: "Phone screen — coding",               description: "Dynamic programming problem. Went well.",                     applicationId: app7.id },
      { type: TimelineEventType.INTERVIEW,  date: daysAgo(18), title: "Virtual onsite — 5 rounds",           description: "2 coding, 2 system design, 1 behavioral.",                   applicationId: app7.id },
      { type: TimelineEventType.REJECTION,  date: daysAgo(10), title: "Rejection email received",            description: "Did not meet staff bar for system design. Can reapply in 6 months.", applicationId: app7.id },
    ],
  });

  await prisma.interview.createMany({
    data: [
      { round: 1, type: InterviewType.PHONE,  scheduledAt: daysAgo(30), durationMinutes: 60,  location: "Zoom", interviewerName: "Alex T.",   interviewerRole: "Senior Engineer", outcome: InterviewOutcome.PASSED, applicationId: app7.id },
      { round: 2, type: InterviewType.ONSITE, scheduledAt: daysAgo(18), durationMinutes: 300, location: "Zoom", interviewerName: "Panel",     interviewerRole: "Various",         outcome: InterviewOutcome.FAILED, notes: "System design round was weak. Need to practice more.", applicationId: app7.id },
    ],
  });

  // ─── Application 8: Shopify — WITHDRAWN ───────────────────────────────────
  const app8 = await prisma.application.create({
    data: {
      role: "Senior Developer, Storefront Renderer",
      location: "Remote (Global)",
      status: ApplicationStatus.WITHDRAWN,
      appliedDate: daysAgo(35),
      jobUrl: "https://www.shopify.com/careers",
      notes: "Withdrew after receiving Stripe offer. Role was interesting but comp was lower.",
      salaryMin: 170000,
      salaryMax: 230000,
      source: "LinkedIn",
      userId: user.id,
      companyId: companies["Shopify"]!,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      { type: TimelineEventType.NOTE,  date: daysAgo(35), title: "Applied on LinkedIn",                      description: "Interesting remote-first role.",                              applicationId: app8.id },
      { type: TimelineEventType.CALL,   date: daysAgo(28), title: "Recruiter call",                           description: "Learned about team and stack (Ruby + React).",                applicationId: app8.id },
      { type: TimelineEventType.NOTE,  date: daysAgo(5),  title: "Withdrew application",                     description: "Accepted Stripe offer. Emailed recruiter to withdraw.",       applicationId: app8.id },
    ],
  });

  // ─── Application 9: Linear — BOOKMARKED ───────────────────────────────────
  const app9 = await prisma.application.create({
    data: {
      role: "Software Engineer, Performance",
      location: "Remote (US/EU)",
      status: ApplicationStatus.BOOKMARKED,
      jobUrl: "https://linear.app/careers",
      notes: "Dream company. Waiting for referral intro from a mutual connection.",
      salaryMin: 180000,
      salaryMax: 240000,
      source: "Twitter/X",
      userId: user.id,
      companyId: companies["Linear"]!,
    },
  });

  await prisma.timelineEvent.create({
    data: { type: TimelineEventType.NOTE, date: daysAgo(3), title: "Bookmarked for later", description: "Karri Saarinen (CEO) posted about this role on X. Want to apply after getting a referral.", applicationId: app9.id },
  });

  await prisma.reminder.create({
    data: { title: "Ask mutual connection for Linear referral", dueDate: daysFromNow(5), type: ReminderType.FOLLOW_UP, userId: user.id, applicationId: app9.id },
  });

  // ─── Application 10: Confluent — APPLIED ─────────────────────────────────
  const app10 = await prisma.application.create({
    data: {
      role: "Software Engineer II, Kafka Streams",
      location: "Austin, TX (Hybrid)",
      status: ApplicationStatus.APPLIED,
      appliedDate: daysAgo(5),
      jobUrl: "https://careers.confluent.io",
      notes: "Applied via career page. Strong fit — lots of Kafka experience from previous role.",
      salaryMin: 165000,
      salaryMax: 220000,
      source: "Company Website",
      userId: user.id,
      companyId: companies["Confluent"]!,
    },
  });

  await prisma.timelineEvent.create({
    data: { type: TimelineEventType.NOTE, date: daysAgo(5), title: "Application submitted", description: "Applied directly. Highlighted Kafka and streaming experience in cover letter.", applicationId: app10.id },
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  const appCount = await prisma.application.count({ where: { userId: user.id } });
  const contactCount = await prisma.contact.count();
  const eventCount = await prisma.timelineEvent.count();
  const interviewCount = await prisma.interview.count();
  const reminderCount = await prisma.reminder.count({ where: { userId: user.id } });

  console.log(`\n🎯 Seed complete!`);
  console.log(`   📋 Applications: ${appCount}`);
  console.log(`   👤 Contacts:     ${contactCount}`);
  console.log(`   📅 Events:       ${eventCount}`);
  console.log(`   🎤 Interviews:   ${interviewCount}`);
  console.log(`   ⏰ Reminders:    ${reminderCount}`);
  console.log("");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
