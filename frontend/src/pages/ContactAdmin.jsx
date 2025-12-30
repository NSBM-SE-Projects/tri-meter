import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logo } from "../assets"

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Contact form submitted:", formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <div className="flex flex-col p-4 bg-black min-h-svh md:p-8">
      {/* Logo */}
      <div className="mb-4">
        <img
          src={logo}
          alt="Tri-Meter Logo"
          className="w-auto h-20"
        />
      </div>

      {/* Centered Contact Form */}
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md">
          <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="mb-1 text-3xl font-bold text-white">Contact Admin</h1>
              <p className="mb-4 text-base text-gray-500">
                Need assistance? Fill out the form below
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-base text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="text-sm text-white rounded-lg h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-base text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="text-sm text-white rounded-lg h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message" className="text-base text-white">
                  Message
                </Label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="flex w-full px-3 py-2 text-sm text-white bg-black border rounded-lg border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
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
    </div>
  )
}
