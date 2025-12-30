import { logo } from "../assets"
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="animate-pulse">
          <img
            src={logo}
            alt="Tri-Meter Logo"
            className="w-auto h-24 md:h-28 lg:h-36"
          />
        </div>

        {/* Spinner */}
        <Loader2 className="w-16 h-16 text-gray-100 animate-spin" />
      </div>
    </div>
  )
}
