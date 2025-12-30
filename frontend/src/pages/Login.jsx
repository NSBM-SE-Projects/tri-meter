import { LoginForm } from "@/components/login-form"
import { sidebarImage, logo } from "../assets"

export default function Login() {
  return (
    <div className="grid overflow-hidden h-svh lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex flex-col lg:p-8 p-8 overflow-y-auto text-white bg-black md:p-10">
        {/* Logo */}
        <div className="flex items-center gap-0">
          <img
            src={logo}
            alt="Tri-Meter Logo"
            className="w-auto h-16 lg:h-22"
          />
          <p className="text-xl md:text-2xl lg:text-2xl font-bold text-white">Tri-Meter</p>
        </div>

        {/* Centered Login Form */}
        <div className="flex items-start p-4 lg:pt-36 pt-40 justify-center flex-1">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar Image */}
      <div className="hidden overflow-hidden bg-zinc-800 lg:flex">
        <img
          src={sidebarImage}
          alt="Tri-Meter utility panels"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
