export function Features() {
  const features = [
    {
      icon: "📋",
      title: "Application Tracking",
      description:
        "Organize every job application with detailed statuses, notes, deadlines, and company information.",
    },
    {
      icon: "🗂️",
      title: "Kanban Workflow",
      description:
        "Visualize your job search using a drag-and-drop Kanban board and quickly update application progress.",
    },
    {
      icon: "👥",
      title: "Recruiter CRM",
      description:
        "Manage recruiter contacts, hiring managers, interviewers, interactions, and follow-ups in one place.",
    },
    {
      icon: "🕒",
      title: "Interview Timeline",
      description:
        "View interviews, online assessments, offers, rejections, and every milestone in a unified chronological timeline.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Monitor application trends, interview rates, status distribution, and overall job search performance.",
    },
    {
      icon: "📄",
      title: "Export & Reports",
      description:
        "Export your applications to CSV and keep a portable record of your complete job search history.",
    },
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-wider mb-3">
            Features
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to manage your job search
          </h2>

          <p className="mt-4 text-brand-400 max-w-2xl mx-auto">
            A modern job application tracker with recruiter CRM, interview
            timeline, analytics, and Kanban workflow—all designed to help you
            stay organized throughout your recruiting journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-hover p-6 group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-brand-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}