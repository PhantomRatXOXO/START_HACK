import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  CalendarClock,
  FlaskConical,
  PenLine,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  Lightbulb,
  FileText,
} from "lucide-react"

// --- Types ---

type Branch = "A" | "B" | "C" | "D"

type Step =
  | { type: "choose-stage" }
  | { type: "b-methodology" }
  | { type: "b-company-supervisor" }
  | { type: "action-screen"; branch: Branch }

interface ActionItem {
  id: string
  label: string
  icon: typeof Search
}

// --- Fields that skip methodology question ---

const SKIP_METHODOLOGY_FIELDS = [
  "Computer Science",
  "Data Science & AI",
  "Engineering",
  "Design & UX",
]

// --- Action sets per branch ---

const BRANCH_A_ACTIONS: ActionItem[] = [
  { id: "topics", label: "Discover thesis topics", icon: Search },
  { id: "companies", label: "Connect with companies", icon: Building2 },
  { id: "literature", label: "Read literature that covers your interests", icon: BookOpen },
  { id: "interviews", label: "Find interview partners (experts)", icon: MessageSquare },
  { id: "peers", label: "Meet fellow students and alumni", icon: Users },
  { id: "supervisors", label: "Discover supervisors from your university", icon: GraduationCap },
]

function getBranchBActions(hasCompany: boolean, hasSupervisor: boolean): ActionItem[] {
  const actions: ActionItem[] = []

  if (!hasCompany) {
    actions.push({ id: "find-company", label: "Find a company partner", icon: Building2 })
  }
  if (!hasSupervisor) {
    actions.push({ id: "supervisors", label: "Discover supervisors from your university", icon: GraduationCap })
  }

  actions.push({ id: "timeline", label: "Plan your timeline and milestones", icon: CalendarClock })
  actions.push({ id: "peers", label: "Meet fellow students and alumni", icon: Users })

  return actions
}

const BRANCH_C_ACTIONS: ActionItem[] = [
  { id: "writing-tips", label: "Tips for writing", icon: Lightbulb },
  { id: "companies", label: "Connect with companies", icon: Building2 },
  { id: "peers", label: "Meet fellow students and alumni", icon: Users },
]

const BRANCH_D_ACTIONS: ActionItem[] = [
  { id: "companies", label: "Contact with companies", icon: Building2 },
  { id: "peers", label: "Meet fellow students and alumni", icon: Users },
]

// --- Flags per branch ---

function getFlag(branch: Branch, hasCompany?: boolean, hasSupervisor?: boolean): string {
  switch (branch) {
    case "A":
      return "Stage: Exploring topics"
    case "B":
      if (hasCompany && hasSupervisor) return "Stage: Planning & organizing"
      return "Stage: Finding company or supervisor"
    case "C":
      return "Stage: Active research"
    case "D":
      return "Stage: Writing & submission"
  }
}

// --- Stage options ---

const STAGES: { id: Branch; label: string; description: string; icon: typeof Search }[] = [
  {
    id: "A",
    label: "Looking for a topic",
    description: "I'm exploring options and haven't committed to a thesis topic yet.",
    icon: Search,
  },
  {
    id: "B",
    label: "Already have a topic - Organizing timeline",
    description: "I have a topic and need to plan methodology, timeline, and structure.",
    icon: CalendarClock,
  },
  {
    id: "C",
    label: "Conducting research",
    description: "I'm in the middle of my thesis - gathering data, running experiments.",
    icon: FlaskConical,
  },
  {
    id: "D",
    label: "Writing and Finalizing",
    description: "I'm writing up my thesis and preparing for submission.",
    icon: PenLine,
  },
]

// --- Component ---

export function OnboardingWizard() {
  const [history, setHistory] = useState<Step[]>([{ type: "choose-stage" }])
  const [branch, setBranch] = useState<Branch | null>(null)
  const [hasMethodology, setHasMethodology] = useState<boolean | null>(null)
  const [hasCompany, setHasCompany] = useState(false)
  const [hasSupervisor, setHasSupervisor] = useState(false)

  // For simplicity, assume field is known (could come from profile).
  // We'll use a state to track it for the methodology skip logic.
  const [field] = useState("Business & Economics") // Default; in real app this comes from profile

  const current = history[history.length - 1]

  const pushStep = (step: Step) => {
    setHistory((prev) => [...prev, step])
  }

  const goBack = () => {
    if (history.length <= 1) return
    const prev = history[history.length - 2]
    // Reset state relevant to the step we're leaving
    if (current.type === "action-screen") {
      if (branch === "B") {
        setHasCompany(false)
        setHasSupervisor(false)
      }
    }
    if (current.type === "b-company-supervisor") {
      setHasMethodology(null)
    }
    if (current.type === "b-methodology") {
      setBranch(null)
    }
    if (current.type === "action-screen" && branch !== "B") {
      setBranch(null)
    }
    setHistory((prev) => prev.slice(0, -1))
  }

  const handleStageSelect = (id: Branch) => {
    setBranch(id)
    if (id === "A" || id === "C" || id === "D") {
      pushStep({ type: "action-screen", branch: id })
    } else if (id === "B") {
      const skipMethodology = SKIP_METHODOLOGY_FIELDS.includes(field)
      if (skipMethodology) {
        pushStep({ type: "b-company-supervisor" })
      } else {
        pushStep({ type: "b-methodology" })
      }
    }
  }

  const handleMethodology = (val: boolean) => {
    setHasMethodology(val)
    pushStep({ type: "b-company-supervisor" })
  }

  const handleCompanySupervisorDone = () => {
    pushStep({ type: "action-screen", branch: "B" })
  }

  // --- Render helpers ---

  const renderActionScreen = (
    title: string,
    actions: ActionItem[],
    flag: string,
  ) => (
    <div>
      <h1 className="ds-title-lg mb-2">{title}</h1>
      <p className="ds-body text-muted-foreground mb-6">
        Here are some things you can start with:
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className="cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-foreground/20 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="size-5" />
                </div>
                <span className="ds-title-cards flex-1">{action.label}</span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="mt-6 flex items-center gap-2">
        <FileText className="size-3 text-muted-foreground" />
        <span className="ds-caption text-muted-foreground">{flag}</span>
      </div>
    </div>
  )

  const renderYesNo = (
    question: string,
    onSelect: (val: boolean) => void,
  ) => (
    <div>
      <h1 className="ds-title-lg mb-2">{question}</h1>
      <p className="ds-body text-muted-foreground mb-8">
        This helps us tailor your next steps.
      </p>
      <div className="flex gap-3 max-w-sm">
        {[true, false].map((val) => (
          <Card
            key={String(val)}
            className="flex-1 cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-foreground/20"
            onClick={() => onSelect(val)}
          >
            <CardContent className="flex items-center justify-center py-2">
              <span className="ds-title-cards">{val ? "Yes" : "No"}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const showContinue = current.type === "b-company-supervisor"

  return (
    <div className="ds-layout-onboarding mx-auto">
      {/* STEP 1: Choose stage */}
      {current.type === "choose-stage" && (
        <div>
          <h1 className="ds-title-lg mb-2">Where are you in your thesis journey?</h1>
          <p className="ds-body text-muted-foreground mb-8">
            We'll adapt everything to where you are right now.
          </p>
          <div className="flex flex-col gap-3">
            {STAGES.map((stage) => {
              const Icon = stage.icon
              return (
                <Card
                  key={stage.id}
                  className="cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-foreground/20"
                  onClick={() => handleStageSelect(stage.id)}
                >
                  <CardContent className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="ds-title-cards">{stage.label}</div>
                      <div className="ds-small text-muted-foreground">
                        {stage.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* BRANCH B — Methodology question */}
      {current.type === "b-methodology" &&
        renderYesNo("Do you have a methodology?", handleMethodology)}

      {/* BRANCH B — Company & Supervisor */}
      {current.type === "b-company-supervisor" && (
        <div>
          <h1 className="ds-title-lg mb-2">Do you have a company and supervisor?</h1>
          <p className="ds-body text-muted-foreground mb-8">
            Let us know what you've already arranged.
          </p>
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Building2 className="size-4" />
                </div>
                <span className="ds-label">Company partner</span>
              </div>
              <button
                onClick={() => setHasCompany(!hasCompany)}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                  hasCompany ? "bg-foreground" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200 ${
                    hasCompany ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <GraduationCap className="size-4" />
                </div>
                <span className="ds-label">Supervisor</span>
              </div>
              <button
                onClick={() => setHasSupervisor(!hasSupervisor)}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                  hasSupervisor ? "bg-foreground" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200 ${
                    hasSupervisor ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION SCREENS */}
      {current.type === "action-screen" && current.branch === "A" &&
        renderActionScreen(
          "Let's get you started",
          BRANCH_A_ACTIONS,
          getFlag("A"),
        )}

      {current.type === "action-screen" && current.branch === "B" &&
        renderActionScreen(
          hasCompany && hasSupervisor
            ? "You're well set up"
            : "Let's fill in the gaps",
          getBranchBActions(hasCompany, hasSupervisor),
          getFlag("B", hasCompany, hasSupervisor),
        )}

      {current.type === "action-screen" && current.branch === "C" &&
        renderActionScreen(
          "Keep the momentum going",
          BRANCH_C_ACTIONS,
          getFlag("C"),
        )}

      {current.type === "action-screen" && current.branch === "D" &&
        renderActionScreen(
          "You're almost there",
          BRANCH_D_ACTIONS,
          getFlag("D"),
        )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={history.length <= 1}
          className="rounded-full"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {showContinue && (
          <Button
            onClick={handleCompanySupervisorDone}
            className="rounded-full"
          >
            Continue
            <ArrowUpRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
