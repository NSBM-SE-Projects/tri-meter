import { LoginForm } from "@/components/login-form"
import { sidebarImage, logo } from "../assets"
import { Heart } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Login() {
  return (
    <div className="grid overflow-hidden h-svh lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="relative flex flex-col lg:p-8 p-4 overflow-y-auto bg-background text-foreground md:p-10">
        {/* Dark Mode Toggle - Top Right */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
          <ModeToggle />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-0 justify-center lg:justify-start pt-7 lg:pt-0">
          <img
            src={logo}
            alt="Tri-Meter Logo"
            className="w-auto h-16 lg:h-22"
          />
          <p className="text-xl md:text-2xl lg:text-2xl font-bold">Tri-Meter</p>
        </div>

        {/* Centered Login Form */}
        <div className="flex items-start p-4 lg:pt-36 pt-20 justify-center flex-1">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm pb-1 lg:pb-4">
          Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> by the Tri-Meter team
        </div>
      </div>

      {/* Right Column - Sidebar Image */}
      <div className="hidden overflow-hidden bg-muted lg:flex">
        <img
          src={sidebarImage}
          alt="Tri-Meter utility panels"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
