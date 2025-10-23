"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, User, BookOpen, History, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/history", label: "History", icon: History },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-gray-200/60 dark:border-gray-700/60 shadow-2xl shadow-black/5">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-2xl px-4 py-3 text-xs font-medium transition-all duration-300 ease-out",
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50",
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 h-1 w-1 rounded-full bg-blue-500 animate-pulse"></div>
              )}
              
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-300", 
                isActive 
                  ? "scale-110 text-blue-600 dark:text-blue-400" 
                  : "group-hover:scale-105 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )} />
              
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive 
                  ? "text-blue-600 dark:text-blue-400 scale-105" 
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
              )}>
                {item.label}
              </span>

              {/* Hover effect background */}
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300",
                isActive ? "opacity-100" : "group-hover:opacity-100"
              )} />
            </Link>
          )
        })}
      </div>

      {/* Safety area for iOS */}
      <div className="h-safe-bottom" />
    </nav>
  )
}