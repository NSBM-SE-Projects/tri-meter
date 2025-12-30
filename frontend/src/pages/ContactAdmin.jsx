import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button, Input, Label } from "@/components/ui"
import { Heart } from "lucide-react"
import { logo } from "../assets"

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  })

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: ""
    }
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      isValid = false
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Handle form submission here
    console.log("Contact form submitted:", formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    // Clear error when user types
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: ""
      })
    }
  }

  return (
    <div className="flex flex-col p-6 bg-black min-h-svh md:p-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-0 mx-auto lg:mx-0 pt-7 lg:pt-0 cursor-pointer">
        <img
          src={logo}
          alt="Tri-Meter Logo"
          className="w-auto h-16 lg:h-22"
        />
        <p className="text-xl md:text-2xl lg:text-2xl font-bold text-white">Tri-Meter</p>
      </Link>

      {/* Centered Contact Form */}
      <div className="flex items-start p-5 lg:p-0 pt-16 md:pt-32 lg:pt-44 justify-center flex-1">
        <div className="w-full max-w-md">
          <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="mb-1 text-3xl font-bold text-white">Contact Admin</h1>
              <p className="mb-4 text-base text-gray-400">
                Need assistance? Fill out the form below
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-base text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "text-sm text-white rounded-lg h-11",
                    errors.name && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-700">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-base text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "text-sm text-white rounded-lg h-11",
                    errors.email && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-700">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message" className="text-base text-gray-300">
                  Message
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your inquiry here..."
                  className={cn(
                    "flex w-full px-3 py-2 text-sm text-white !bg-black border rounded-lg border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.message && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.message && (
                  <p className="text-sm text-red-700">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-2 text-base font-semibold text-black bg-white rounded-lg h-11 hover:bg-gray-200"
              >
                Send Request
              </Button>
            </div>

            <div className="text-sm text-center">
              <Link to="/" className="text-white underline underline-offset-4 hover:text-gray-300">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm pb-4 lg:pb-4">
        Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> by the Tri-Meter team
      </div>
    </div>
  )
}
