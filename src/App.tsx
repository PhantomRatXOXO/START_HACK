import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Wand2,
  Users,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react"

import { OnboardingWizard } from "@/components/pages/OnboardingWizard"
import { PeerNetwork } from "@/components/pages/PeerNetwork"
import { CourseSuggestions } from "@/components/pages/CourseSuggestions"
import { ThesisPrep } from "@/components/pages/ThesisPrep"
import { ProjectManager } from "@/components/pages/ProjectManager"

import "./App.css"

type Page = "onboarding" | "peers" | "courses" | "prep" | "project"

const NAV_ITEMS: { id: Page; label: string; icon: typeof Wand2; badge?: string }[] = [
  { id: "onboarding", label: "Onboarding", icon: Wand2 },
  { id: "peers", label: "Peer Network", icon: Users },
  { id: "courses", label: "Course Suggestions", icon: GraduationCap, badge: "Company" },
  { id: "prep", label: "Thesis Prep", icon: BookOpen },
  { id: "project", label: "Project Manager", icon: LayoutDashboard },
]

function Logo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    // Icon only — the geometric mark from the top-right of the full logo
    return (
      <div className="flex items-center justify-center px-1">
        <svg width="24" height="24" viewBox="247 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M269.67 22.8L287.28 32.96V21.98L277.77 16.49V5.51003L268.26 11V20.36L269.67 22.8Z" fill="currentColor"/>
          <path d="M268.89 24.14L276.99 28.82V39.8L267.48 34.31L257.97 39.8L248.46 34.31L266.07 24.14H268.89Z" fill="currentColor"/>
          <path d="M266.7 20.36V0.0300293L257.19 5.52003V16.5L247.68 21.99L257.19 27.48L265.29 22.81L266.7 20.36Z" fill="currentColor"/>
        </svg>
      </div>
    )
  }

  // Full wordmark
  return (
    <div className="flex items-center px-2">
      <svg width="115" height="32" viewBox="0 0 288 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M269.67 22.8L287.28 32.96V21.98L277.77 16.49V5.51003L268.26 11V20.36L269.67 22.8Z" fill="currentColor"/>
        <path d="M268.89 24.14L276.99 28.82V39.8L267.48 34.31L257.97 39.8L248.46 34.31L266.07 24.14H268.89Z" fill="currentColor"/>
        <path d="M266.7 20.36V0.0300293L257.19 5.52003V16.5L247.68 21.99L257.19 27.48L265.29 22.81L266.7 20.36Z" fill="currentColor"/>
        <path d="M0.759998 60.72V59.52H7.67V60.56C7.67 63.75 9.91 64.92 13.79 64.92H13.9C16.98 64.92 19.13 64.02 19.13 61.73V60.86C19.13 58.46 17.73 57.9 14.49 57.48L9.82 56.86C4.48 56.22 1.37 53.67 1.37 48.5V47.6C1.37 42.45 6.15 38.99 12.98 38.99H13.06C19.86 38.99 24.81 41.79 24.81 47.94V48.95H17.93V47.94C17.93 45.4 15.69 44.56 12.84 44.56H12.73C9.93 44.56 8.17 45.51 8.17 47.47V48.2C8.17 50.24 9.29 51.16 11.97 51.53L17 52.2C22.43 52.9 25.95 54.77 25.95 60.37V61.29C25.95 67.14 20.92 70.46 13.78 70.46H13.67C5.47 70.46 0.75 66.99 0.75 60.73L0.759998 60.72Z" fill="currentColor"/>
        <path d="M53.07 45.71V39.81H41.69V32.76H34.75V39.81H29.02V45.71H34.75V63.11C34.75 67.95 36.15 69.65 41.63 69.65H47.2V63.75H44.37C42.28 63.75 41.69 63.39 41.69 61.04V45.71H53.07Z" fill="currentColor"/>
        <path d="M55.12 58.68V39.8H62.03V58.12C62.03 62.87 64.04 64.61 67.62 64.61H67.68C71.26 64.61 73.27 62.88 73.27 58.12V39.8H80.18V69.64H73.27V67.32C72.26 68.97 69.13 70.45 65.97 70.45H65.91C59.37 70.45 55.11 66.62 55.11 58.67L55.12 58.68Z" fill="currentColor"/>
        <path d="M97.34 70.43C90.77 70.43 86.52 66.6 86.52 58.65V50.76C86.52 42.82 90.77 38.98 97.34 38.98H97.4C101.18 38.98 103.69 40.46 104.67 42.11V28.81H111.58V69.64H104.67V67.29C103.69 68.94 101.17 70.42 97.4 70.42H97.34V70.43ZM99.1 64.58C102.65 64.58 104.67 62.87 104.67 58.12V51.3C104.67 46.54 102.66 44.81 99.1 44.81H99.04C95.46 44.81 93.45 46.54 93.45 51.3V58.12C93.45 62.87 95.46 64.58 99.04 64.58H99.1Z" fill="currentColor"/>
        <path d="M114.88 39.8H122.04L127.8 58.82H131.94L137.93 39.8H145.09L132.59 79.43H125.46L130.1 64.75H122.66L114.88 39.8Z" fill="currentColor"/>
        <path d="M147.21 58.54V50.88C147.21 42.88 151.52 38.99 159.71 38.99H159.77C167.97 38.99 172.27 42.88 172.27 50.88V58.54C172.27 66.54 167.96 70.45 159.77 70.45H159.71C151.52 70.45 147.21 66.53 147.21 58.54ZM159.77 64.64C163.35 64.64 165.36 62.88 165.36 58.12V51.3C165.36 46.54 163.35 44.81 159.77 44.81H159.71C156.13 44.81 154.12 46.54 154.12 51.3V58.12C154.12 62.87 156.13 64.64 159.71 64.64H159.77Z" fill="currentColor"/>
        <path d="M179.13 39.8H186.07V42.12C187.05 40.47 190.21 38.99 193.34 38.99H193.4C199.94 38.99 204.19 42.82 204.19 50.77V69.65H197.28V51.33C197.28 46.57 195.27 44.84 191.69 44.84H191.63C188.08 44.84 186.06 46.57 186.06 51.33V69.65H179.12V39.81L179.13 39.8Z" fill="currentColor"/>
        <path d="M221.61 70.43C215.04 70.43 210.79 66.6 210.79 58.65V50.76C210.79 42.82 215.04 38.98 221.61 38.98H221.67C225.45 38.98 227.96 40.46 228.94 42.11V28.81H235.85V69.64H228.94V67.29C227.96 68.94 225.44 70.42 221.67 70.42H221.61V70.43ZM223.38 64.58C226.93 64.58 228.95 62.87 228.95 58.12V51.3C228.95 46.54 226.94 44.81 223.38 44.81H223.32C219.74 44.81 217.73 46.54 217.73 51.3V58.12C217.73 62.87 219.74 64.58 223.32 64.58H223.38Z" fill="currentColor"/>
      </svg>
    </div>
  )
}

function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme")
    if (stored) return stored === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

export default function App() {
  const [page, setPage] = useState<Page>("onboarding")
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()

  const renderPage = () => {
    switch (page) {
      case "onboarding":
        return <OnboardingWizard />
      case "peers":
        return <PeerNetwork />
      case "courses":
        return <CourseSuggestions />
      case "prep":
        return <ThesisPrep />
      case "project":
        return <ProjectManager />
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`flex flex-col border-r border-border bg-background transition-all duration-200 ${
            collapsed ? "w-14" : "w-60"
          }`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center px-3">
            <Logo collapsed={collapsed} />
          </div>

          <Separator />

          {/* Nav */}
          <nav className="flex flex-1 flex-col gap-1 p-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = page === item.id
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setPage(item.id)}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        active
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ds-caption">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* AI badge */}
          {!collapsed && (
            <div className="p-3">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                <Sparkles className="size-4 text-ai-solid" />
                <div>
                  <div className="ds-caption font-medium">AI-powered</div>
                  <div className="ds-caption text-muted-foreground">by Studyond Brain</div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Theme + Collapse */}
          <div className="relative flex items-center gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={theme.toggle}
                >
                  {theme.dark ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
            </Tooltip>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(true)}
                className="ml-auto"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            )}
            {collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(false)}
                    className="absolute left-full ml-1"
                  >
                    <PanelLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="scroll-area">
            <div className="scroll-area-content">{renderPage()}</div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
