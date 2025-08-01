import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

export default function layout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-0 pb-12">
        <SidebarTrigger className="text-white m-1 p-2 fixed top-3 text-xl right-2 z-20 md:hidden" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}