import { BarChart3, BadgeDollarSign, CreditCard, GaugeIcon, HelpCircleIcon, LayoutDashboardIcon, PlugIcon, Receipt, SearchIcon, SettingsIcon, ShieldCheck, UsersIcon } from "lucide-react"
import { NavMain, NavSecondary, NavUser } from "@/components"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupLabel } from "@/components/ui"
import { logo } from "../assets"
import { useAuth } from "@/context/AuthContext"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Customers",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Service Connections",
      url: "#",
      icon: PlugIcon,
    },
    {
      title: "Meter Readings",
      url: "#",
      icon: GaugeIcon,
    },
    {
      title: "Bills",
      url: "#",
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
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#/contact-admin",
      icon: HelpCircleIcon,
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth()

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

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <div className="flex h-full w-full flex-col bg-sidebar-background">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
          <a href="#" className="flex items-center justify-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-sidebar-accent lg:justify-start">
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
