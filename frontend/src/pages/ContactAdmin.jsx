import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button, Input, Label } from "@/components/ui"
import { Heart } from "lucide-react"
import { logo } from "../assets"
import { LoadingOverlay } from "../components/LoadingOverlay"
import { ModeToggle } from "@/components/mode-toggle"

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error'
  const [inquiryId, setInquiryId] = useState(null)

  const validateForm = () => {
    const newErrors = {
      email: "",
      subject: "",
      message: ""
    }
    let isValid = true

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      isValid = false
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit inquiry')
      }

      setSubmitStatus('success')
      setInquiryId(data.data.inquiryId)
      // Reset form
      setFormData({
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error('Inquiry submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="relative flex flex-col p-6 bg-background min-h-svh md:p-8">
      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay />}

      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
        <ModeToggle />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-0 mx-auto lg:mx-0 pt-7 lg:pt-0 cursor-pointer">
        <img
          src={logo}
          alt="Tri-Meter Logo"
          className="w-auto h-16 lg:h-22"
        />
        <p className="text-xl md:text-2xl lg:text-2xl font-bold text-foreground">Tri-Meter</p>
      </Link>

      {/* Centered Contact Form */}
      <div className="flex items-start p-5 lg:p-0 pt-10 md:pt-32 lg:pt-44 justify-center flex-1">
        <div className="w-full max-w-md">
          <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="mb-1 text-3xl font-bold text-foreground">Contact Admin</h1>
              <p className="mb-4 text-base text-muted-foreground">
                Need assistance? Fill out the form below
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-base text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "text-sm rounded-lg h-11",
                    errors.email && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-700">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subject" className="text-base text-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className={cn(
                    "text-sm rounded-lg h-11",
                    errors.subject && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.subject && (
                  <p className="text-sm text-red-700">{errors.subject}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message" className="text-base text-foreground">
                  Message
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your inquiry here..."
                  className={cn(
                    "flex w-full px-3 py-2 text-sm bg-background border rounded-lg border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.message && "border-red-700 focus-visible:ring-red-700"
                  )}
                />
                {errors.message && (
                  <p className="text-sm text-red-700">{errors.message}</p>
                )}
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-5 p-3 text-sm text-green-500 bg-green-950 border border-green-700 rounded-lg">
                  Your inquiry <span className="font-semibold">#{inquiryId}</span> has been submitted successfully! We'll get back to you soon : )
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-5 p-3 text-sm text-red-700 bg-red-950 border border-red-800 rounded-lg">
                  Failed to submit inquiry. Please try again later.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-7 text-base font-semibold rounded-lg h-11 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </div>

            <div className="text-sm text-center">
              <Link to="/" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-muted-foreground text-sm pb-4 lg:pb-4">
        Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> by the Tri-Meter team
      </div>
    </div>
  )
}
