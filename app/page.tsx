export default function ChurchHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-5">
          <a
            href="/login"
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:py-32">
        <div className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 backdrop-blur-sm">
          Secure • Organized • Modern
        </div>

        <h2 className="max-w-4xl text-5xl leading-tight font-extrabold tracking-tight md:text-6xl">
          ECWA GOODNEWS 1, MASAKA.
          <br />
          <span className="bg-linear-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            Church Membership
          </span>
          <br />
          Management System
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          A modern church management platform for securely storing member
          information, managing workers, and organizing spiritual records with
          role-based access control.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/login"
            className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Access Dashboard
          </a>

          <a
            href="#features"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition hover:bg-white/10"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          {
            title: "Centralized Records",
            desc: "Securely manage all church member information in one place.",
          },
          {
            title: "Role-Based Access",
            desc: "Admins and workers have permissions tailored to their responsibilities.",
          },
          {
            title: "Spiritual Tracking",
            desc: "Keep detailed spiritual and discipline records efficiently.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-white/0.03 relative z-10 border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-emerald-400 uppercase">
              Features
            </p>

            <h3 className="mt-4 text-4xl font-bold tracking-tight">
              Everything Needed To Manage Church Membership
            </h3>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Secure Authentication",
              "Member Records Management",
              "Role-Based Permissions",
              "Children Information Tracking",
              "Spiritual & Discipline Records",
              "Advanced Search & Filtering",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-emerald-500/40 hover:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-xl">
                  ✨
                </div>

                <h4 className="mt-6 text-lg font-semibold">{feature}</h4>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Built with scalability, security, and simplicity in mind for
                  church administrators and workers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] border border-white/10 bg-linear-to-r from-emerald-500/20 to-sky-500/20 p-10 backdrop-blur-xl lg:p-16">
            <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h3 className="text-4xl font-bold tracking-tight">
                  Built For Modern Church Administration
                </h3>

                <p className="mt-5 text-lg leading-8 text-slate-300">
                  Simplify record keeping, improve organization, and securely
                  manage church membership data from one unified platform.
                </p>
              </div>

              <a
                href="/login"
                className="rounded-2xl bg-white px-8 py-4 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Go To Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-end gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <p>© 2026 ECWA GOODNEWS 1, MASAKA. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
