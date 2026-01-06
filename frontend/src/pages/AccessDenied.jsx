import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components'

export default function AccessDenied() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md p-8">
        <div className="mb-5">
          <ShieldAlert className="mx-auto h-32 w-32 text-red-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>

        <p className="text-muted-foreground mb-1 font-medium">
          You don't have permission to access this request.
        </p>

        {user?.role && (
          <p className="text-sm text-muted-foreground mb-10">
            Your role: <span className="font-medium text-foreground">{user.role}</span>
          </p>
        )}

        <div className="flex flex-col-2 gap-10">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
