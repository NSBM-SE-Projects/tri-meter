import { BarChart3, BadgeDollarSign, CreditCard, GaugeIcon, HelpCircleIcon, LayoutDashboardIcon, PlugIcon, Receipt, SearchIcon, SettingsIcon, ShieldCheck, UsersIcon } from "lucide-react"
import { NavMain, NavSecondary, NavUser } from "@/components"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui"
import { logo } from "../assets"

const data = {
  user: {
    name: "Username",
    role: "Role",
    avatar: "/avatars/user.jpg",
  },
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <div className="flex h-full w-full flex-col bg-neutral-900">
        <SidebarHeader className="border-b border-neutral-700 px-3 py-3">
          <a href="#" className="flex items-center justify-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-neutral-800">
            <img src={logo} alt="Tri-Meter Logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-gray-200">Tri-Meter</span>
          </a>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter className="border-t border-neutral-700">
          <NavUser user={data.user} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
