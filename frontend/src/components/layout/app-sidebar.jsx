import { BarChart3, BadgeDollarSign, CreditCard, GaugeIcon, HelpCircleIcon, LayoutDashboardIcon, PlugIcon, Receipt, SearchIcon, SettingsIcon, ShieldCheck, UsersIcon } from "lucide-react"
import { NavMain, NavSecondary, NavUser } from "@/components"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupLabel } from "@/components/ui"
import { logo } from "../../assets"
import { useAuth } from "@/context/AuthContext"

const allNavItems = [
  {
    title: "Dashboard",
    url: "#/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Customers",
    url: "#/customers",
    icon: UsersIcon,
  },
  {
    title: "Service Connections",
    url: "#/service-connections",
    icon: PlugIcon,
  },
  {
    title: "Meter Readings",
    url: "#/meter-readings",
    icon: GaugeIcon,
  },
  {
    title: "Bills",
    url: "#/bills",
    icon: Receipt,
  },
  {
    title: "Payments",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Tariffs",
    url: "#",
    icon: BadgeDollarSign,
  },
  {
    title: "Reports",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "System Users",
    url: "#",
    icon: ShieldCheck,
  },
]

// Role-based perms
const rolePermissions = {
  'Admin': ['Dashboard', 'Customers', 'Service Connections', 'Meter Readings', 'Bills', 'Payments', 'Tariffs', 'Reports', 'System Users'],
  'Manager': ['Dashboard', 'Customers', 'Service Connections', 'Meter Readings', 'Bills', 'Payments', 'Reports'],
  'Field Officer': ['Dashboard', 'Meter Readings', 'Service Connections', 'Customers'],
  'Cashier': ['Dashboard', 'Bills', 'Payments', 'Customers']
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth()

  // Role based filter
  const filteredNavItems = allNavItems.filter(item => {
    if (!user || !user.role) return false
    const allowedItems = rolePermissions[user.role] || []
    return allowedItems.includes(item.title)
  })

  const userData = user
    ? {
        name: user.fullName || user.username,
        role: user.role,
        avatar: user.profilePhoto || null
      }
    : {
        name: "Guest",
        role: "Invalid login",
        avatar: null,
      }

  const data = {
    navMain: filteredNavItems,
    navSecondary: [
      {
        title: "Get Help",
        url: "#/contact-admin",
        icon: HelpCircleIcon,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <div className="flex flex-col w-full h-full bg-sidebar-background">
        <SidebarHeader className="px-3 py-3 border-b border-sidebar-border">
          <a href="#" className="flex items-center justify-center gap-2 px-2 py-2 transition-colors rounded-md hover:bg-sidebar-accent lg:justify-start">
            <img src={logo} alt="Tri-Meter Logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-sidebar-foreground">Tri-Meter</span>
          </a>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
            <NavMain items={data.navMain} />
          </SidebarGroup>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <NavUser user={userData} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
