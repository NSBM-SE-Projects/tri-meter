import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check localStorage for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tri-meter-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    // Mock login - replace with actual API call later
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock user data
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: credentials.username + '@example.com',
        role: 'customer',
        avatar: '/src/assets/logo-no-bg-white.png'
      }

      // Save to state and localStorage
      setUser(mockUser)
      localStorage.setItem('tri-meter-user', JSON.stringify(mockUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tri-meter-user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
