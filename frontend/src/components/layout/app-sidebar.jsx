import { useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  Plug,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  HelpCircle,
  MoreVertical,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User as UserIcon } from 'lucide-react'
import logoBlack from '@/assets/logo-no-bg-black.png'
import logoWhite from '@/assets/logo-no-bg-white.png'

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Customers', url: '/customers', icon: Users },
  { title: 'Meter Readings', url: '/meter-readings', icon: Activity },
  { title: 'Bills', url: '/billing', icon: FileText },
  { title: 'Service Connections', url: '/service-connections', icon: Plug },
  { title: 'Payments', url: '/payments', icon: CreditCard },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
  { title: 'Admin Panel', url: '/admin', icon: ShieldCheck },
  { title: 'Settings', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const logoImage = theme === 'dark' ? logoWhite : logoBlack

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-8 border-b">
        <Link to="/dashboard" className="flex items-center justify-center gap-2">
          <img src={logoImage} alt="Tri-Meter" className="w-auto h-24 transition-all duration-300 hover:scale-105" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive} className="px-3 py-2">
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 space-y-4 border-t">
        <Button variant="ghost" className="justify-start w-full gap-3 text-base" size="default">
          <HelpCircle className="w-5 h-5" />
          Get Help
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-sm">{user?.name?.charAt(0) || 'J'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium">{user?.name?.split(' ')[0] || 'johndoe'}</span>
              <span className="text-sm text-muted-foreground">User role</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-base">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="text-base py-2">
                <UserIcon className="mr-2 h-5 w-5" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 text-base py-2">
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
