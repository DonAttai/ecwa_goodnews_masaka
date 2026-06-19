import { Heart } from "lucide-react"

export default function DashboardFooter() {
  return (
    <footer className="shrink-0 border-t border-[#e2dcd5]/30 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-8">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-[#8a95a8] sm:text-sm md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA</p>
        <p className="flex items-center gap-1.5">
          Built with
          <Heart className="inline h-3 w-3 font-bold text-[#c9a84c]" />
          for the church
        </p>
        <p className="font-bold text-[#c9a84c]/60">Membership Management</p>
      </div>
    </footer>
  )
}
