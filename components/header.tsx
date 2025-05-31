"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { BookOpen, Menu, X, Home, PlusCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check if we should show the sidebar based on the current path
  const shouldShowSidebar = !pathname.includes("/exam/") && !pathname.includes("/add-exam")

  // Initialize sidebar state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed.toString())
  }, [isSidebarCollapsed])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      {shouldShowSidebar && (
        <div
          className={cn(
            "fixed left-0 top-0 z-30 h-screen border-r border-r-border bg-white/80 dark:bg-card/80 backdrop-blur-md transition-all duration-300 hidden md:block",
            isSidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!isSidebarCollapsed && (
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ExamBank</span>
              </Link>
            )}
            {isSidebarCollapsed && (
              <Link href="/" className="flex items-center justify-center w-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </Link>
            )}
          </div>
          <div className="p-4 space-y-1">
            <Link
              href="/"
              className={cn(
                "sidebar-item",
                pathname === "/" && "sidebar-item-active",
                isSidebarCollapsed && "justify-center px-2",
              )}
            >
              <Home className="h-5 w-5" />
              {!isSidebarCollapsed && <span>หน้าหลัก</span>}
            </Link>
            <Link
              href="/add-exam"
              className={cn(
                "sidebar-item",
                pathname === "/add-exam" && "sidebar-item-active",
                isSidebarCollapsed && "justify-center px-2",
              )}
            >
              <PlusCircle className="h-5 w-5" />
              {!isSidebarCollapsed && <span>เพิ่มข้อสอบใหม่</span>}
            </Link>
          </div>

          {/* Collapse/Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-background border shadow-sm flex items-center justify-center p-0"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={cn("sidebar md:hidden", isSidebarOpen && "open")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">ExamBank</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 space-y-1">
          <Link href="/" className={cn("sidebar-item", pathname === "/" && "sidebar-item-active")}>
            <Home className="h-5 w-5" />
            หน้าหลัก
          </Link>
          <Link href="/add-exam" className={cn("sidebar-item", pathname === "/add-exam" && "sidebar-item-active")}>
            <PlusCircle className="h-5 w-5" />
            เพิ่มข้อสอบใหม่
          </Link>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main header - with search */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full glass-solid border-b",
          shouldShowSidebar && !isSidebarCollapsed && "md:pl-64",
          shouldShowSidebar && isSidebarCollapsed && "md:pl-16",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ExamBank</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ค้นหาข้อสอบหรือคำตอบ..."
                  className="w-[200px] lg:w-[300px] pl-9 pr-4 glass border-none focus-visible:ring-primary/50 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="container py-2 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ค้นหาข้อสอบหรือคำตอบ..."
                  className="w-full pl-9 pr-4 glass border-none focus-visible:ring-primary/50 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </header>
    </>
  )
}
