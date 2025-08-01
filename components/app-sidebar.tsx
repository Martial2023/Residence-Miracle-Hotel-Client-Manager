"use client"

import * as React from "react"
import {
  ChartColumnStacked,
  ChevronsUpDown,
  Cog,
  CookingPot,
  Diff,
  SquareStack,
  Table2
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useCurrentUser } from "@/lib/useCurrentUser"
import { fetchRestaurant } from "@/app/actions/actions"

const navigation = [
  {
    label: "Commandes",
    icon: ChevronsUpDown,
    href: "/orders"
  },

  {
    label: "Tableau de bord",
    icon: ChartColumnStacked,
    href: "/dashboard"
  },

  {
    label: "Menu",
    icon: CookingPot,
    href: "/products"
  },

  {
    label: "Catégories",
    icon: SquareStack,
    href: "/categories"
  },

  {
    label: "Tables",
    icon: Table2,
    href: "/tables"
  },

  {
    label: "Bilans",
    icon: Diff,
    href: "/reports"
  },

  {
    label: "Paramètres",
    icon: Cog,
    href: "/settings"
  }
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [restaurantName, setRestaurantName] = React.useState<string | null>("");
  const user = useCurrentUser();
  const fetchUseRestaurant = async () => {
    try {
      const restaurant = await fetchRestaurant();
      setRestaurantName(restaurant?.name || null);
    } catch (error) {
      console.error("Error fetching user restaurant:", error);
    }
  }
  React.useEffect(() => {
    if (user?.id) {
      fetchUseRestaurant();
    }
  }, [user]);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Image
                  src={"/logo.png"}
                  width={40}
                  height={40}
                  className="text-primary-500 -mr-1 mb-1"
                  alt="ClientManager"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="text-primary">{process.env.NEXT_PUBLIC_NAME_FIRST}</span>
                    <span className="dark:text-white">{process.env.NEXT_PUBLIC_NAME_SECOND}</span>
                  </h2>
                  <span className="truncate text-sm">{restaurantName}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarMenu className="flex flex-col p-2 gap-4">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.label} className="rounded-xl">
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
