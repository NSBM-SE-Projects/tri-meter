import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="mb-2 text-4xl font-bold text-white">Login to your account</h1>
        <p className="mb-8 text-lg text-gray-500">
          Tri-Meter: Utility Management System
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="Username" className="text-lg">Username</Label>
          <Input
            id="username"
            type="text"
            required
            className="text-base rounded-lg h-14"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-lg">Password</Label>
            <a href="#" className="ml-auto text-sm text-gray-50 underline-offset-4 hover:text-white hover:underline">
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-12 text-base rounded-lg h-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full mt-4 text-lg font-semibold text-black bg-white rounded-lg h-14 hover:bg-gray-200">
          Login
        </Button>
      </div>
      <div className="text-base text-center">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Contact Admin
        </a>
      </div>
    </form>
  );
}
