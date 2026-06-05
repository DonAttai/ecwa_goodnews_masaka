export default function DashboardFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-slate-400 md:flex-row">
        <p>© {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA</p>

        <p>Church Membership Management System</p>
      </div>
    </footer>
  )
}
