import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Bell, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b shrink-0 bg-background">
      <div className="flex items-center gap-8">
        <SidebarTrigger className="lg:hidden" />
        <nav className="items-center hidden gap-6 lg:flex">
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-muted/50"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
