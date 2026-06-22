export function HowItWorks() {
  const steps = [
    { step: "01", title: "Sign In", description: "Connect with Google or GitHub in one click." },
    { step: "02", title: "Add Applications", description: "Log each company, role, and application date." },
    { step: "03", title: "Track Progress", description: "Update stages as you move through the pipeline." },
    { step: "04", title: "Land the Offer", description: "Review your journey and celebrate your wins." },
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-wider mb-3">Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How it works</h2>
        </div>
        <div className="space-y-8">
          {steps.map((item, i) => (
            <div key={item.step} className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg group-hover:bg-accent/20 transition-colors">
                {item.step}
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-brand-400 text-sm mt-1">{item.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
