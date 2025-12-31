import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex items-center justify-between w-full gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9" />
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
