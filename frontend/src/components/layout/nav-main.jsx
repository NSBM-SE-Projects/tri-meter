import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components"

export function NavMain({ items }) {
  const currentPath = window.location.hash

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-6 lg:gap-3">
          {items.map((item) => {
            const isActive = currentPath === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <a href={item.url} className="text-sidebar-foreground font-medium">
                    {item.icon && <item.icon strokeWidth={2.0} />}
                    <span className="text-sidebar-foreground">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
