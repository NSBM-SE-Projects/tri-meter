import { LoginForm } from "@/components/login-form"
import { sidebarImage, logo } from "../assets"

export default function Login() {
  return (
    <div className="grid overflow-hidden h-svh lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex flex-col p-6 overflow-y-auto text-white bg-black md:p-10">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={logo}
            alt="Tri-Meter Logo"
            className="w-auto h-40"
          />
        </div>

        {/* Centered Login Form */}
        <div className="flex items-center justify-center flex-1">
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
