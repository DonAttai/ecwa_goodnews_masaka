export default function ChurchHomePage() {
  const date = new Date()
  const year = date.getFullYear()
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle Background Glow - Changed to gold */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              ECWA Goodnews 1, Masaka.
            </span>
          </div>

          {/* Only Login */}
          <a
            href="/login"
            className="rounded-lg border border-border bg-muted/30 px-4 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/50 sm:px-5 sm:py-2 sm:text-sm"
          >
            Login
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-32">
          <div className="mb-5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            Secure • Organized • Modern
          </div>

          <h2 className="max-w-4xl text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            ECWA GOODNEWS 1, MASAKA.
            <br />
            <span className="text-gold">Church Membership</span>
            <br />
            Management System
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">
            A modern church management platform for securely storing member
            information, managing workers, and organizing spiritual records with
            role-based access control.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="/login"
              className="btn-gold rounded-2xl px-6 py-3 text-center font-semibold sm:px-8 sm:py-4"
            >
              Access Dashboard
            </a>

            <a
              href="#features"
              className="rounded-2xl border border-border bg-muted/30 px-6 py-3 text-center font-semibold text-foreground backdrop-blur-sm transition hover:bg-muted/50 sm:px-8 sm:py-4"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 pb-16 sm:grid-cols-2 sm:gap-6 sm:px-6 sm:pb-20 lg:grid-cols-3">
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
              className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30 hover:bg-card sm:p-8"
            >
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Features */}
        <section
          id="features"
          className="relative z-10 border-t border-border py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Features
              </p>

              <h3 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:mt-4 sm:text-4xl">
                Everything Needed To Manage Church Membership
              </h3>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                  className="rounded-3xl border border-border bg-card/50 p-5 transition hover:border-primary/40 hover:bg-card sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-lg sm:h-12 sm:w-12 sm:text-xl">
                    ✨
                  </div>

                  <h4 className="mt-5 text-lg font-semibold text-foreground sm:mt-6 sm:text-xl">
                    {feature}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
                    Built with scalability, security, and simplicity in mind for
                    church administrators and workers.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/20 to-primary/5 p-6 backdrop-blur-xl sm:rounded-[2rem] sm:p-8 md:p-10 lg:p-16">
              <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                    Built For Modern Church Administration
                  </h3>

                  <p className="mt-4 text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
                    Simplify record keeping, improve organization, and securely
                    manage church membership data from one unified platform.
                  </p>
                </div>

                <a
                  href="/login"
                  className="btn-gold rounded-2xl px-6 py-3 text-center font-semibold whitespace-nowrap sm:px-8 sm:py-4"
                >
                  Go To Login
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 sm:text-sm">
          <p>© {year} ECWA GOODNEWS 1, MASAKA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
