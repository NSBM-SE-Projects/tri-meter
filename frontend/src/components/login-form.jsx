import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { LoadingOverlay } from "./LoadingOverlay"
import { useAuth } from "@/context/AuthContext"

export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  })

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: ""
    }
    let isValid = true

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({ username: "", password: "" })

    try {
      // Login function (authContext)
      await login(formData.username, formData.password)

      console.log('Login Successful!')

      navigate('/dashboard')
    } catch (error) {
      console.error('LOGIN ERROR:', error)
      setErrors({
        username: "",
        password: error.message || 'Login failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }))
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="mb-1 text-4xl font-bold">Login to your account</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Tri-Meter: Utility Management System
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-lg text-foreground">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={cn(
              "!text-base rounded-lg h-14",
              errors.username && "border-red-700 focus-visible:ring-red-700"
            )}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-lg">Password</Label>
            <Link to="/contact-admin" className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={cn(
                "pr-12 !text-base rounded-lg h-14",
                errors.password && "border-red-700 focus-visible:ring-red-700"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full mt-4 text-lg font-semibold rounded-lg h-14 disabled:opacity-50 disabled:cursor-not-allowed">
          Login
        </Button>
      </div>
      <div className="text-base text-center">
        Don&apos;t have an account?{" "}
        <Link to="/contact-admin" className="underline underline-offset-4">
          Contact Admin
        </Link>
      </div>
    </form>
    </>
  );
}
