import { useState, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { PAPERS } from "@/components/pages/ThesisPrep"
import {
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  MessageSquare,
  Play,
  Square,
  Trash2,
  Pencil,
} from "lucide-react"

type TaskStatus = "done" | "in-progress" | "upcoming" | "overdue"

interface Task {
  id: string
  title: string
  status: TaskStatus
  dueDate?: string
  description?: string
  aiSuggested?: boolean
}

interface Phase {
  id: string
  name: string
  weeks: string
  color: string
  tasks: Task[]
}

interface MatchContext {
  student: {
    name: string
    university: string
    field: string
    level: string
  }
  company: {
    name: string
    topic: string
    contact: string
  }
  supervisor: {
    name: string
    department: string
  }
  matchScore: number
  matchReasons: string[]
}

const MATCH_CONTEXT: MatchContext = {
  student: {
    name: "You",
    university: "ETH Zurich",
    field: "Data Science & AI",
    level: "Master",
  },
  company: {
    name: "Swiss Re",
    topic: "AI-Driven Risk Assessment for Climate Portfolios",
    contact: "Dr. Elena Fischer, Innovation Lead",
  },
  supervisor: {
    name: "Prof. Dr. M. Wegmann",
    department: "Computer Science, ETH Zurich",
  },
  matchScore: 94,
  matchReasons: [
    "Your ML/NLP skills align with the company's AI requirements",
    "Professor Wegmann's research in applied AI covers this domain",
    "Swiss Re has successfully supervised 3 theses through Studyond",
  ],
}

const PHASES: Phase[] = [
  {
    id: "planning",
    name: "Planning",
    weeks: "Weeks 1-3",
    color: "bg-foreground",
    tasks: [
      { id: "p1", title: "Kick-off meeting with supervisor & company", status: "done", dueDate: "Mar 4" },
      { id: "p2", title: "Define research questions (max 3)", status: "done", dueDate: "Mar 7" },
      { id: "p3", title: "Literature review — collect 20+ papers", status: "in-progress", dueDate: "Mar 18" },
      { id: "p4", title: "Choose methodology and justify approach", status: "upcoming", dueDate: "Mar 21" },
      { id: "p5", title: "Draft thesis outline (chapter structure)", status: "upcoming", dueDate: "Mar 25" },
      { id: "p6", title: "Submit research proposal to supervisor", status: "upcoming", dueDate: "Mar 28" },
    ],
  },
  {
    id: "data",
    name: "Data Collection",
    weeks: "Weeks 4-8",
    color: "bg-muted-foreground",
    tasks: [
      { id: "d1", title: "Sign NDA with Swiss Re", status: "upcoming", dueDate: "Apr 1" },
      { id: "d2", title: "Set up data access and pipeline", status: "upcoming", dueDate: "Apr 8" },
      { id: "d3", title: "Design interview guide for 5 experts", status: "upcoming", dueDate: "Apr 11", aiSuggested: true },
      { id: "d4", title: "Conduct expert interviews", status: "upcoming", dueDate: "Apr 25" },
      { id: "d5", title: "Clean and preprocess dataset", status: "upcoming", dueDate: "May 2" },
      { id: "d6", title: "Mid-point check-in with supervisor", status: "upcoming", dueDate: "May 6" },
    ],
  },
  {
    id: "analysis",
    name: "Analysis & Implementation",
    weeks: "Weeks 9-16",
    color: "bg-muted-foreground/60",
    tasks: [
      { id: "a1", title: "Implement baseline model", status: "upcoming", dueDate: "May 16" },
      { id: "a2", title: "Run experiments and iterate", status: "upcoming", dueDate: "Jun 6" },
      { id: "a3", title: "Analyze results and compare to baselines", status: "upcoming", dueDate: "Jun 20" },
      { id: "a4", title: "Present preliminary findings to Swiss Re", status: "upcoming", dueDate: "Jun 27", aiSuggested: true },
      { id: "a5", title: "Supervisor feedback session", status: "upcoming", dueDate: "Jul 1" },
    ],
  },
  {
    id: "writing",
    name: "Writing & Finalization",
    weeks: "Weeks 17-24",
    color: "bg-muted-foreground/40",
    tasks: [
      { id: "w1", title: "Write methodology and results chapters", status: "upcoming", dueDate: "Jul 18" },
      { id: "w2", title: "Write introduction and literature review", status: "upcoming", dueDate: "Aug 1" },
      { id: "w3", title: "Write discussion and conclusion", status: "upcoming", dueDate: "Aug 8" },
      { id: "w4", title: "Internal review with supervisor", status: "upcoming", dueDate: "Aug 15" },
      { id: "w5", title: "Final revisions and formatting", status: "upcoming", dueDate: "Aug 22" },
      { id: "w6", title: "Submit thesis", status: "upcoming", dueDate: "Aug 29" },
    ],
  },
]

function statusIcon(status: TaskStatus) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="size-5 text-foreground transition-transform duration-200 scale-110" />
    case "in-progress":
      return <Circle className="size-5 text-foreground" />
    case "overdue":
      return <AlertCircle className="size-5 text-destructive" />
    case "upcoming":
      return <Circle className="size-5 text-muted-foreground/50" />
  }
}

function statusLabel(status: TaskStatus) {
  switch (status) {
    case "done":
      return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Done</Badge>
    case "in-progress":
      return (
        <Badge variant="outline" className="border-foreground/30 text-foreground gap-1">
          <span className="size-1.5 rounded-full bg-foreground animate-pulse inline-block" />
          In progress
        </Badge>
      )
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    case "upcoming":
      return null
  }
}

export function ProjectManager({ savedPaperIds = [] }: { savedPaperIds?: string[] }) {
  // Build a "Literature" phase from saved papers in Thesis Prep
  const literaturePhase: Phase | null = useMemo(() => {
    if (savedPaperIds.length === 0) return null
    const tasks: Task[] = savedPaperIds.map((paperId) => {
      const paper = PAPERS.find((p) => p.id === paperId)
      return {
        id: `lit-${paperId}`,
        title: `Read "${paper?.title ?? "Unknown paper"}"`,
        status: "upcoming" as TaskStatus,
      }
    })
    return {
      id: "literature",
      name: "Literature",
      weeks: `${savedPaperIds.length} paper${savedPaperIds.length === 1 ? "" : "s"} saved`,
      color: "bg-foreground",
      tasks,
    }
  }, [savedPaperIds])

  const allPhases = useMemo(() => {
    return literaturePhase ? [literaturePhase, ...PHASES] : PHASES
  }, [literaturePhase])

  const [expandedPhases, setExpandedPhases] = useState<string[]>(["planning"])
  const [taskStates, setTaskStates] = useState<Record<string, TaskStatus>>(() => {
    const initial: Record<string, TaskStatus> = {}
    PHASES.forEach((phase) => {
      phase.tasks.forEach((task) => {
        initial[task.id] = task.status
      })
    })
    return initial
  })

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  // Single click: toggle done ↔ previous state (upcoming or in-progress)
  const toggleDone = (id: string) => {
    setTaskStates((prev) => {
      const current = prev[id]
      if (current === "done") {
        // Restore to upcoming (or in-progress if it was in-progress before)
        return { ...prev, [id]: "upcoming" }
      }
      // Mark as done from any state
      return { ...prev, [id]: "done" }
    })
  }

  // Start working on a task (set to in-progress)
  const startTask = (id: string) => {
    setTaskStates((prev) => {
      const current = prev[id]
      if (current === "in-progress") {
        return { ...prev, [id]: "upcoming" }
      }
      return { ...prev, [id]: "in-progress" }
    })
  }

  // Date state — parse initial "Mon DD" strings into Date objects (year 2026)
  const [taskDates, setTaskDates] = useState<Record<string, Date | undefined>>(() => {
    const initial: Record<string, Date | undefined> = {}
    PHASES.forEach((phase) => {
      phase.tasks.forEach((task) => {
        if (task.dueDate) {
          initial[task.id] = new Date(`${task.dueDate}, 2026`)
        } else {
          initial[task.id] = undefined
        }
      })
    })
    return initial
  })

  const setTaskDate = (id: string, date: Date | undefined) => {
    setTaskDates((prev) => ({ ...prev, [id]: date }))
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return undefined
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Custom tasks added by the user, keyed by phase id
  const [customTasks, setCustomTasks] = useState<Record<string, Task[]>>({})
  const taskCounter = useRef(0)

  const addTask = (phaseId: string) => {
    const id = `custom-${phaseId}-${taskCounter.current++}`
    const newTask: Task = {
      id,
      title: "",
      status: "upcoming",
    }
    setCustomTasks((prev) => ({
      ...prev,
      [phaseId]: [...(prev[phaseId] || []), newTask],
    }))
    setTaskStates((prev) => ({ ...prev, [id]: "upcoming" }))
    setTaskDates((prev) => ({ ...prev, [id]: undefined }))
    // Immediately enter edit mode for the new task
    setEditingTask(id)
    setEditingTitle("")
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  // Track deleted default tasks
  const [deletedTasks, setDeletedTasks] = useState<Set<string>>(new Set())

  // Editing state
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [taskTitles, setTaskTitles] = useState<Record<string, string>>({})
  const editInputRef = useRef<HTMLInputElement>(null)

  const removeTask = (phaseId: string, taskId: string) => {
    // Remove custom task
    setCustomTasks((prev) => ({
      ...prev,
      [phaseId]: (prev[phaseId] || []).filter((t) => t.id !== taskId),
    }))
    // Mark default task as deleted
    setDeletedTasks((prev) => new Set(prev).add(taskId))
    setTaskStates((prev) => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })
    setTaskDates((prev) => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })
  }

  const startEditing = (taskId: string, currentTitle: string) => {
    setEditingTask(taskId)
    setEditingTitle(currentTitle)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const saveEdit = (taskId: string) => {
    const trimmed = editingTitle.trim()
    if (trimmed) {
      setTaskTitles((prev) => ({ ...prev, [taskId]: trimmed }))
    } else {
      // Empty title — delete the task (find which phase it belongs to)
      for (const phase of PHASES) {
        // Check if it's a default task
        if (phase.tasks.some((t) => t.id === taskId)) {
          removeTask(phase.id, taskId)
          break
        }
        // Check if it's a custom task
        if ((customTasks[phase.id] || []).some((t) => t.id === taskId)) {
          removeTask(phase.id, taskId)
          break
        }
      }
    }
    setEditingTask(null)
  }

  const getTaskTitle = (task: Task) => taskTitles[task.id] || task.title


  const statusOrder: Record<TaskStatus, number> = {
    "done": 0,
    "in-progress": 1,
    "overdue": 2,
    "upcoming": 3,
  }

  const allPhaseTasks = (phase: Phase) => {
    const tasks = [
      ...phase.tasks.filter((t) => !deletedTasks.has(t.id)),
      ...(customTasks[phase.id] || []),
    ]
    return tasks.sort((a, b) => {
      const statusA = taskStates[a.id] || a.status
      const statusB = taskStates[b.id] || b.status
      const orderDiff = statusOrder[statusA] - statusOrder[statusB]
      if (orderDiff !== 0) return orderDiff
      const dateA = taskDates[a.id]
      const dateB = taskDates[b.id]
      if (dateA && dateB) return dateA.getTime() - dateB.getTime()
      if (dateA) return -1
      if (dateB) return 1
      return 0
    })
  }

  const totalTasks = allPhases.reduce((sum, p) => sum + allPhaseTasks(p).length, 0)
  const doneTasks = Object.values(taskStates).filter((s) => s === "done").length
  const inProgressTasks = Object.values(taskStates).filter((s) => s === "in-progress").length

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="ds-title-lg mb-1">Project Manager</h1>
        <p className="ds-body text-muted-foreground">
          AI-generated thesis plan with tasks, deadlines, and matching context.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div>
          {/* Progress overview */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-3 py-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <div className="ds-title-cards">{doneTasks}/{totalTasks}</div>
                  <div className="ds-caption text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="size-4" />
                </div>
                <div>
                  <div className="ds-title-cards">{inProgressTasks}</div>
                  <div className="ds-caption text-muted-foreground">In progress</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <CalendarIcon className="size-4" />
                </div>
                <div>
                  <div className="ds-title-cards">Aug 29</div>
                  <div className="ds-caption text-muted-foreground">Deadline</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="ds-label">Overall progress</span>
              <span className="ds-small text-muted-foreground">
                {Math.round((doneTasks / totalTasks) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>

          {/* AI nudge */}
          <Card className="border-ai mb-6">
            <CardContent className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai">
                <Sparkles className="size-4" />
              </div>
              <div>
                <div className="ds-label mb-0.5">AI Suggestion</div>
                <p className="ds-small text-muted-foreground">
                  Your literature review is due today. You've collected 14 papers so far —
                  consider adding 6 more from the <strong className="text-foreground">Thesis Prep</strong> recommendations
                  to meet the 20-paper target. Two papers on climate risk AI were published this week.
                </p>
                <Button variant="outline" size="sm" className="mt-2 rounded-full">
                  <ArrowRight className="size-3" />
                  View literature suggestions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phase list */}
          <div className="flex flex-col gap-4">
            {allPhases.map((phase) => {
              const expanded = expandedPhases.includes(phase.id)
              const phaseTasks = allPhaseTasks(phase)
              const phaseDone = phaseTasks.filter((t) => taskStates[t.id] === "done").length
              const phaseTotal = phaseTasks.length

              return (
                <Card key={phase.id}>
                  <CardHeader
                    className="cursor-pointer select-none"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expanded ? (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="ds-title-cards">{phase.name}</CardTitle>
                          <CardDescription>{phase.weeks}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="ds-small text-muted-foreground">
                          {phaseDone}/{phaseTotal}
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${phase.color} transition-all duration-300`}
                            style={{
                              width: `${phaseTotal > 0 ? (phaseDone / phaseTotal) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded && (
                    <CardContent>
                      <div className="flex flex-col gap-0.5">
                        {phaseTasks.map((task) => {
                          const currentStatus = taskStates[task.id] || task.status
                          const isDone = currentStatus === "done"
                          const isInProgress = currentStatus === "in-progress"
                          const taskDate = taskDates[task.id]
                          const isOverdue = !isDone && taskDate != null && taskDate < new Date(new Date().setHours(0, 0, 0, 0))
                          return (
                            <div
                              key={task.id}
                              className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                                isDone
                                  ? "opacity-50"
                                  : isInProgress
                                  ? "bg-secondary/60 border-l-2 border-foreground"
                                  : "hover:bg-secondary/40"
                              }`}
                            >
                              {/* Play/Stop button — start or stop working on task */}
                              <button
                                onClick={() => !isDone && startTask(task.id)}
                                className={`shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 ${
                                  isDone ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                                title={isDone ? "Complete the task first" : isInProgress ? "Stop working" : "Start working"}
                                disabled={isDone}
                              >
                                {isInProgress ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                                    <circle cx="12" cy="12" r="10" />
                                    <rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none" />
                                  </svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                                    <circle cx="12" cy="12" r="10" />
                                    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                                  </svg>
                                )}
                              </button>

                              {/* Task title — click to toggle done, hover previews strikethrough */}
                              {editingTask === task.id ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === "Escape") {
                                      e.currentTarget.blur()
                                    }
                                  }}
                                  onBlur={() => saveEdit(task.id)}
                                  className="ds-small flex-1 bg-transparent border-b border-muted-foreground/30 focus:border-foreground outline-none px-1 py-0.5"
                                />
                              ) : (
                                <span
                                  onClick={() => toggleDone(task.id)}
                                  className={`ds-small flex-1 cursor-pointer select-none rounded px-1 -mx-1 py-0.5 ${
                                    isDone
                                      ? "line-through decoration-2 decoration-muted-foreground text-muted-foreground/50 hover:bg-secondary hover:text-muted-foreground/70"
                                      : "hover:line-through hover:decoration-2 hover:decoration-foreground/40 hover:bg-secondary/80"
                                  }`}
                                  title={isDone ? "Click to mark as incomplete" : "Click to complete"}
                                >
                                  {getTaskTitle(task)}
                                </span>
                              )}

                              {/* Right side info */}
                              <div className="flex items-center shrink-0">
                                {task.aiSuggested && (
                                  <Sparkles className="size-3 text-ai-solid mr-2" />
                                )}
                                <span className="w-24 text-right">
                                  {isOverdue ? statusLabel("overdue") : statusLabel(currentStatus)}
                                </span>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      className={`ds-caption whitespace-nowrap w-16 hover:text-foreground transition-colors flex items-center justify-center gap-1 ${
                                        isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                                      }`}
                                      title="Change due date"
                                    >
                                      {formatDate(taskDates[task.id]) || (
                                        <CalendarIcon className="size-3 opacity-0 group-hover:opacity-50 mx-auto" />
                                      )}
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="end">
                                    <CalendarWidget
                                      mode="single"
                                      selected={taskDates[task.id]}
                                      onSelect={(date) => setTaskDate(task.id, date)}
                                      captionLayout="dropdown"
                                      startMonth={new Date(2025, 0)}
                                      endMonth={new Date(2030, 11)}
                                    />
                                    {taskDates[task.id] && (
                                      <div className="border-t px-3 py-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-full rounded-full text-muted-foreground"
                                          onClick={() => setTaskDate(task.id, undefined)}
                                        >
                                          Remove date
                                        </Button>
                                      </div>
                                    )}
                                  </PopoverContent>
                                </Popover>
                                <button
                                  onClick={() => startEditing(task.id, getTaskTitle(task))}
                                  className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground hover:text-foreground transition-all duration-200"
                                  title="Edit task"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  onClick={() => removeTask(phase.id, task.id)}
                                  className="opacity-0 group-hover:opacity-100 ml-3 text-muted-foreground hover:text-destructive transition-all duration-200"
                                  title="Delete task"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full rounded-full text-muted-foreground"
                        onClick={() => addTask(phase.id)}
                      >
                        <Plus className="size-3" />
                        Add task
                      </Button>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar — Matching Context */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="ds-title-sm flex items-center gap-2">
                <Target className="size-4" />
                Matching Context
              </CardTitle>
              <CardDescription>
                The thesis-student-company triangle powering this project.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center">
                <span className="text-ai ds-title-lg font-semibold">
                  {MATCH_CONTEXT.matchScore}%
                </span>
                <div className="ds-caption text-muted-foreground">Overall match</div>
              </div>

              <Separator />

              {/* Student */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="ds-label">Student</div>
                  <div className="ds-small text-muted-foreground">
                    {MATCH_CONTEXT.student.name}
                  </div>
                  <div className="ds-caption text-muted-foreground">
                    {MATCH_CONTEXT.student.level} — {MATCH_CONTEXT.student.field}
                  </div>
                  <div className="ds-caption text-muted-foreground">
                    {MATCH_CONTEXT.student.university}
                  </div>
                </div>
              </div>

              {/* Company */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <div className="ds-label">Company</div>
                  <div className="ds-small text-muted-foreground">
                    {MATCH_CONTEXT.company.name}
                  </div>
                  <div className="ds-caption text-muted-foreground">
                    {MATCH_CONTEXT.company.contact}
                  </div>
                </div>
              </div>

              {/* Supervisor */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <GraduationCap className="size-4" />
                </div>
                <div>
                  <div className="ds-label">Supervisor</div>
                  <div className="ds-small text-muted-foreground">
                    {MATCH_CONTEXT.supervisor.name}
                  </div>
                  <div className="ds-caption text-muted-foreground">
                    {MATCH_CONTEXT.supervisor.department}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Topic */}
              <div>
                <div className="ds-label mb-1 flex items-center gap-1">
                  <BookOpen className="size-3" />
                  Thesis Topic
                </div>
                <p className="ds-small font-medium">{MATCH_CONTEXT.company.topic}</p>
              </div>

              <Separator />

              {/* Match reasons */}
              <div>
                <div className="ds-label mb-2 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Why this works
                </div>
                <ul className="space-y-1.5">
                  {MATCH_CONTEXT.matchReasons.map((reason, i) => (
                    <li key={i} className="ds-caption text-muted-foreground flex items-start gap-1.5">
                      <CheckCircle2 className="size-3 mt-0.5 shrink-0 text-foreground" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full rounded-full">
                  <MessageSquare className="size-4" />
                  Message company
                </Button>
                <Button variant="outline" size="sm" className="w-full rounded-full">
                  <FileText className="size-4" />
                  View full proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
