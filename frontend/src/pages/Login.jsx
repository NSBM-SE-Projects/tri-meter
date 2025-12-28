import { LoginForm } from "@/components/login-form"
import sidebarImage from "@/assets/side-bar.png";
import logoImage from "@/assets/logo-no-bg-white.png";

export default function LoginPage() {
  return (
    <div className="grid bg-black min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start">
          <img src={logoImage} alt="Tri-Meter Logo" className="w-auto h-28" />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-black lg:flex lg:items-center lg:justify-end lg:pr-0">
        <img
          src={sidebarImage}
          alt="Tri-Meter utility panels"
          className="w-[1200px] h-[1000px] object-contain object-right"
        />
      </div>
    </div>
  )
}
