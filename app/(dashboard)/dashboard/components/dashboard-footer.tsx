export default function DashboardFooter() {
  return (
    <footer className="shrink-0 border-t border-slate-800 bg-slate-950 px-4 py-4 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 sm:text-sm md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA</p>
        <p>Church Membership Management System</p>
      </div>
    </footer>
  )
}
