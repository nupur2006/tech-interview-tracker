export function Features() {
  const features = [
    {
      icon: "📋",
      title: "Timeline Tracking",
      description: "Track every stage from application to offer with visual timelines.",
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description: "Never miss a follow-up email or prep session with automated reminders.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Understand your pipeline with conversion rates and response times.",
    },
    {
      icon: "🏢",
      title: "Company Profiles",
      description: "Store notes, interview formats, and compensation data per company.",
    },
    {
      icon: "📝",
      title: "Interview Notes",
      description: "Capture questions asked, your answers, and post-interview reflections.",
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      description: "Set weekly application targets and track your progress over time.",
    },
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to land the role</h2>
          <p className="mt-4 text-brand-400 max-w-xl mx-auto">Powerful tools designed specifically for the tech interview grind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass-hover p-6 group">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">{feature.title}</h3>
              <p className="text-sm text-brand-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
