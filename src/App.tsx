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
  return (
    <div className="flex items-center gap-2.5 px-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M31.67 12.8L39.28 17.96V12.98L34.77 10.49V5.01L30.26 7.5V12.36L31.67 14.8Z"
          fill="currentColor"
          transform="translate(-22, 0)"
        />
        <path
          d="M30.89 16.14L34.99 18.82V24.8L30.48 22.31L25.97 24.8L21.46 22.31L30.07 16.14H30.89Z"
          fill="currentColor"
          transform="translate(-22, 0)"
        />
        <path
          d="M29.7 12.36V0.03L24.19 3.02V10.5L18.68 13.49L24.19 16.48L28.29 13.81L29.7 12.36Z"
          fill="currentColor"
          transform="translate(-22, 0)"
        />
      </svg>
      {!collapsed && (
        <span className="ds-title-sm font-semibold tracking-tight">studyond</span>
      )}
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
          <div className="flex items-center gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={theme.toggle}
                  className={collapsed ? "w-full" : ""}
                >
                  {theme.dark ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "top"}>
                {theme.dark ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
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
                    className="w-full"
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
