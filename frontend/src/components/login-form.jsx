import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function LoginForm({
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login({ username, password })
      if (result.success) {
        navigate("/dashboard")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-8 -mt-24", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 mb-2 text-center">
        <h1 className="text-4xl font-bold text-white">Login</h1>
        <p className="text-lg text-neutral-300">
          Tri-Meter: Utility Management System
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <Label htmlFor="username" className="text-lg text-white">Username</Label>
          <Input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-14 bg-[#1a2840] border-[#2a3850] rounded-lg text-white placeholder:text-gray-500 focus-visible:ring-[#3a4860]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-lg text-white">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pr-12 bg-[#1a2840] border-[#2a3850] rounded-lg text-white placeholder:text-gray-500 focus-visible:ring-[#3a4860]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="p-3 text-sm text-center text-red-500 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-24 text-lg font-semibold text-black transition-all duration-200 ease-in-out bg-white rounded-lg shadow-lg h-14 hover:bg-gray-100 hover:scale-105 active:scale-95 hover:shadow-xl disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="mb-3 text-center ">
          <a href="#" className="text-lg text-white hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </form>
  );
}
