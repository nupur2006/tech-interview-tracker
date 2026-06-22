"use client";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 dot-grid" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[96px] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Now tracking 10,000+ interviews
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance animate-slide-up">
          <span className="text-white">Track Every Step of</span>
          <br />
          <span className="gradient-text">Your Interview Journey</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-brand-400 max-w-2xl mx-auto text-balance animate-slide-up animate-delay-100">
          From application to offer letter. Organize your tech interview
          pipeline, manage timelines, and never miss a follow-up again.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-200">
          <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-xl transition-all duration-200 shadow-lg shadow-accent/25">
            Get Started Free
          </a>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-brand-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200">
            See How it Works
          </a>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in animate-delay-300">
          {[
            { value: "10K+", label: "Interviews Tracked" },
            { value: "2.5K+", label: "Offers Landed" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-brand-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
