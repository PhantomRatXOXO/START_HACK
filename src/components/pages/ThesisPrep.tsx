import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Star,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  FileText,
  Users,
  Target,
  TrendingUp,
  Search,
  Bookmark,
  BookmarkCheck,
  X,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react"

interface Tip {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  isNew: boolean
}

export interface Paper {
  id: string
  title: string
  authors: string
  year: number
  journal: string
  relevanceScore: number
  reason: string
  tags: string[]
}

interface Review {
  id: string
  studentName: string
  studentInitials: string
  university: string
  topic: string
  rating: number
  text: string
  date: string
  helpful: number
}

const TIPS: Tip[] = [
  {
    id: "1",
    title: "Start with 'why', not 'what'",
    description: "Before picking a topic, identify what problems fascinate you. A thesis driven by genuine curiosity produces better work and makes the 4-6 months far more bearable.",
    category: "Topic Selection",
    readTime: "2 min",
    isNew: true,
  },
  {
    id: "2",
    title: "Talk to 3 people before committing",
    description: "Before locking in your topic, talk to at least one professor, one industry professional, and one student who recently completed their thesis. Different perspectives reveal blind spots.",
    category: "Topic Selection",
    readTime: "3 min",
    isNew: true,
  },
  {
    id: "3",
    title: "Your supervisor match matters more than the topic",
    description: "A great supervisor with a good-enough topic beats a perfect topic with an absent supervisor. Look for someone who is responsive, has relevant expertise, and whose advising style matches yours.",
    category: "Supervisor",
    readTime: "3 min",
    isNew: false,
  },
  {
    id: "4",
    title: "Scope ruthlessly — then scope again",
    description: "The #1 mistake in thesis writing is overscoping. If your topic sounds like it could be a PhD dissertation, narrow it down. A focused, well-executed thesis always beats an ambitious, half-finished one.",
    category: "Planning",
    readTime: "2 min",
    isNew: false,
  },
  {
    id: "5",
    title: "Build your literature base early",
    description: "Start collecting and reading papers from day one. Use a reference manager (Zotero, Mendeley) and annotate as you go. Your future self writing the lit review will thank you.",
    category: "Literature",
    readTime: "4 min",
    isNew: false,
  },
  {
    id: "6",
    title: "Company partnerships unlock real data",
    description: "Working with a company partner gives you access to real-world datasets, interview subjects, and practical problems. It also makes your thesis more impactful and employable.",
    category: "Company",
    readTime: "3 min",
    isNew: true,
  },
]

export const PAPERS: Paper[] = [
  {
    id: "1",
    title: "Skills-Based Hiring and the Practice of Student Assessment in Higher Education",
    authors: "K. Mueller, A. Schmidt, R. Weber",
    year: 2025,
    journal: "Journal of Higher Education Policy",
    relevanceScore: 94,
    reason: "Directly related to Studyond's matching approach",
    tags: ["Skills-Based Hiring", "Assessment", "Higher Education"],
  },
  {
    id: "2",
    title: "Three-Sided Platform Markets: A Systematic Review",
    authors: "L. Chen, M. Hagiu",
    year: 2024,
    journal: "Research Policy",
    relevanceScore: 89,
    reason: "Framework applicable to student-company-university platforms",
    tags: ["Platform Economics", "Marketplace", "Business Models"],
  },
  {
    id: "3",
    title: "AI-Mediated Matching in Labor Markets: Efficiency and Fairness",
    authors: "P. Roth, J. Zimmermann",
    year: 2025,
    journal: "Management Science",
    relevanceScore: 87,
    reason: "Methodology for evaluating AI matching quality",
    tags: ["AI", "Matching", "Labor Markets"],
  },
  {
    id: "4",
    title: "The Student Thesis Journey: A Mixed-Methods Longitudinal Study",
    authors: "S. Anderson, R. Patel",
    year: 2024,
    journal: "Studies in Higher Education",
    relevanceScore: 85,
    reason: "Maps emotional and practical stages of thesis writing",
    tags: ["Thesis Process", "Student Experience", "Research Methods"],
  },
  {
    id: "5",
    title: "Context Accumulation in Conversational AI: Beyond Session Boundaries",
    authors: "T. Li, D. Vaswani, F. Wu",
    year: 2025,
    journal: "ACL Proceedings",
    relevanceScore: 82,
    reason: "Technical approach to building persistent AI context",
    tags: ["Conversational AI", "Context", "NLP"],
  },
  // Extra papers that appear when searching or via tag-based suggestions
  {
    id: "6",
    title: "Transformer Architectures for Domain-Specific Text Classification",
    authors: "R. Devlin, H. Zhao",
    year: 2025,
    journal: "EMNLP Proceedings",
    relevanceScore: 78,
    reason: "Relevant NLP technique for text-based matching systems",
    tags: ["NLP", "Transformers", "Text Classification"],
  },
  {
    id: "7",
    title: "Bias Mitigation in Automated Hiring: A Survey",
    authors: "A. Raghavan, S. Kim",
    year: 2024,
    journal: "AI & Society",
    relevanceScore: 80,
    reason: "Addresses fairness concerns in AI-driven talent matching",
    tags: ["AI", "Bias", "Skills-Based Hiring"],
  },
  {
    id: "8",
    title: "Network Effects in Multi-Sided Educational Platforms",
    authors: "M. Cusumano, Y. Tanaka",
    year: 2025,
    journal: "Strategic Management Journal",
    relevanceScore: 83,
    reason: "Analyzes growth dynamics relevant to student-company platforms",
    tags: ["Platform Economics", "Network Effects", "Higher Education"],
  },
  {
    id: "9",
    title: "Large Language Models for Academic Literature Discovery",
    authors: "J. Wei, C. Borgeaud",
    year: 2025,
    journal: "Nature Machine Intelligence",
    relevanceScore: 76,
    reason: "LLM-based approaches to literature search and recommendation",
    tags: ["NLP", "AI", "Literature Review"],
  },
  {
    id: "10",
    title: "Competency Frameworks in Swiss Higher Education: A Comparative Study",
    authors: "F. Berger, L. Kühn",
    year: 2024,
    journal: "European Journal of Education",
    relevanceScore: 74,
    reason: "Maps competency models used by Swiss universities",
    tags: ["Higher Education", "Assessment", "Competency Models"],
  },
  {
    id: "11",
    title: "Marketplace Design for Thin Markets: Lessons from Academic Job Matching",
    authors: "A. Roth, E. Shorrer",
    year: 2024,
    journal: "American Economic Review",
    relevanceScore: 81,
    reason: "Matching theory applicable to student-thesis-company markets",
    tags: ["Matching", "Marketplace", "Market Design"],
  },
  {
    id: "12",
    title: "Student Motivation and Self-Regulated Learning in Research Projects",
    authors: "B. Zimmerman, K. Paulsen",
    year: 2023,
    journal: "Educational Psychology Review",
    relevanceScore: 72,
    reason: "Framework for understanding student engagement in thesis work",
    tags: ["Student Experience", "Motivation", "Research Methods"],
  },
]


// All unique tags across papers, used for suggestion chips
const ALL_TAGS = Array.from(new Set(PAPERS.flatMap((p) => p.tags)))

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}

function PaperCard({
  paper,
  isSaved,
  onToggleSave,
}: {
  paper: Paper
  isSaved: boolean
  onToggleSave: () => void
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="flex gap-4">
        {/* Paper info */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="ds-title-cards">{paper.title}</span>
          </div>
          <p className="ds-small text-muted-foreground">
            {paper.authors} ({paper.year}) — <em>{paper.journal}</em>
          </p>
          <div className="ds-small text-muted-foreground flex items-start gap-1.5">
            <Target className="size-3 mt-1 shrink-0" />
            {paper.reason}
          </div>
          <div className="flex flex-wrap gap-1">
            {paper.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="ds-caption">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right side — relevance + actions */}
        <div className="flex flex-row items-center gap-2 justify-center mr-8">
          <div className="text-center">
            <span className="text-ai text-lg font-bold">{paper.relevanceScore}%</span>
            <div className="ds-caption text-muted-foreground">relevant</div>
          </div>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className="rounded-full w-1/2"
            onClick={onToggleSave}
          >
            {isSaved ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="default" size="sm" className="rounded-full w-1/2">
            <ArrowUpRight className="size-4" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ThesisPrep({
  savedPaperIds: propSavedPaperIds,
  setSavedPaperIds: propSetSavedPaperIds,
}: {
  savedPaperIds: string[]
  setSavedPaperIds: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [completedTips, setCompletedTips] = useState<string[]>([])
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("savedPaperIds")
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    localStorage.setItem("savedPaperIds", JSON.stringify(savedPaperIds))
  }, [savedPaperIds])

  const toggleTip = (id: string) => {
    setCompletedTips((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const toggleSave = (id: string) => {
    setSavedPaperIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  // Tags from saved papers — used to boost suggestions
  const savedTags = useMemo(() => {
    const tags = PAPERS.filter((p) => savedPaperIds.includes(p.id)).flatMap((p) => p.tags)
    const counts: Record<string, number> = {}
    for (const tag of tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
    return counts
  }, [savedPaperIds])

  // Suggested tags based on what user has saved (YouTube-style chips)
  const suggestedTags = useMemo(() => {
    if (Object.keys(savedTags).length === 0) return ALL_TAGS.slice(0, 8)
    // Sort tags: saved tags first (by frequency), then remaining
    return [...ALL_TAGS].sort((a, b) => {
      const aCount = savedTags[a] || 0
      const bCount = savedTags[b] || 0
      return bCount - aCount
    }).slice(0, 8)
  }, [savedTags])

  // Filter and rank papers
  const displayedPapers = useMemo(() => {
    let papers = [...PAPERS]

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      papers = papers.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.journal.toLowerCase().includes(q)
      )
    }

    // Filter by active tag
    if (activeTags.length > 0) {
      papers = papers.filter((p) => activeTags.some((t) => p.tags.includes(t)))
    }

    // Sort by relevance
    papers.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return papers
  }, [searchQuery, activeTags, savedTags])

  const savedPapers = PAPERS.filter((p) => savedPaperIds.includes(p.id))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="ds-title-lg mb-1">Thesis Preparation</h1>
        <p className="ds-body text-muted-foreground">
          Tips, literature, and reviews to help you prepare before you start writing.
        </p>
      </div>

      {/* AI insight */}
      <Card className="border-ai mb-6">
        <CardContent className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="ds-label mb-0.5">Personalized for you</div>
            <p className="ds-small text-muted-foreground">
              Based on your profile in <strong className="text-foreground">Data Science & AI</strong> at
              ETH Zurich, we've curated tips from students in similar programs and
              literature aligned with your interests in NLP and matching systems.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="literature">
        {/* Tips */}
        <TabsContent value="tips">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="literature">
                <BookOpen className="size-4" />
                Literature
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="size-4" />
                Tips
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="ds-small text-muted-foreground">
              {completedTips.length} of {TIPS.length} completed
            </p>
            <div className="h-1 flex-1 mx-4 rounded-full bg-secondary max-w-xs">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-300"
                style={{ width: `${(completedTips.length / TIPS.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip) => {
              const done = completedTips.includes(tip.id)
              return (
                <Card
                  key={tip.id}
                  className={`transition-all duration-200 ${done ? "opacity-60" : ""}`}
                >
                  <CardContent className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTip(tip.id)}
                      className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="size-5 text-foreground" />
                      ) : (
                        <Circle className="size-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`ds-title-cards ${done ? "line-through" : ""}`}>
                          {tip.title}
                        </span>
                        {tip.isNew && <Badge variant="secondary">New</Badge>}
                      </div>
                      <p className="ds-small text-muted-foreground">{tip.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Badge variant="outline">{tip.category}</Badge>
                        <span className="ds-caption text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {tip.readTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Literature */}
        <TabsContent value="literature">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="literature">
                <BookOpen className="size-4" />
                Literature
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="size-4" />
                Tips
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search bar with filter toggle */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search papers by title, author, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <Button
                variant={showFilters || activeTags.length > 0 ? "default" : "outline"}
                size="icon"
                className="shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="size-4" />
              </Button>
              {/* Dropdown filter list — multi-select */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-1 z-10 w-56 rounded-lg border bg-background p-1 shadow-md">
                  {activeTags.length > 0 && (
                    <button
                      onClick={() => setActiveTags([])}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  {suggestedTags.map((tag) => {
                    const isActive = activeTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => setActiveTags(
                          isActive ? activeTags.filter((t) => t !== tag) : [...activeTags, tag]
                        )}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive ? "bg-secondary font-medium" : "hover:bg-secondary/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5 text-muted-foreground" />}
                          {tag}
                        </span>
                        {savedTags[tag] && <Sparkles className="size-3 text-ai-solid" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {activeTags.map((tag) => (
                <Badge key={tag} variant="default" className="px-3 py-1">
                  {tag}
                  <button onClick={() => setActiveTags(activeTags.filter((t) => t !== tag))} className="ml-1">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Saved papers section */}
          {!searchQuery && activeTags.length === 0 && (
            <div className="mb-4">
              <Button
                variant="outline"
                className="rounded-full mb-3"
                onClick={() => setShowSaved(!showSaved)}
              >
                <BookmarkCheck className="size-4 text-primary" />
                Your saved literature ({savedPapers.length})
                <ChevronRight className={`size-4 transition-transform duration-200 ${showSaved ? "rotate-90" : ""}`} />
              </Button>
              {showSaved && (
                <div className="flex flex-col gap-3 mb-4">
                  {savedPapers.map((paper) => (
                    <PaperCard
                      key={`saved-${paper.id}`}
                      paper={paper}
                      isSaved={true}
                      onToggleSave={() => toggleSave(paper.id)}
                    />
                  ))}
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-2 mt-4 mb-3">
                <Sparkles className="size-4 text-ai-solid" />
                <span className="ds-label">Suggested for you</span>
                <span className="ds-caption text-muted-foreground">based on your saved papers</span>
              </div>
            </div>
          )}

          {/* Paper list */}
          <div className="flex flex-col gap-3">
            {displayedPapers
              .filter((p) => !(!searchQuery && activeTags.length === 0 && savedPaperIds.includes(p.id)))
              .map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSaved={savedPaperIds.includes(paper.id)}
                  onToggleSave={() => toggleSave(paper.id)}
                />
              ))}
          </div>

          {displayedPapers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-3 size-8 text-muted-foreground" />
              <p className="ds-title-sm text-muted-foreground">No papers found</p>
              <p className="ds-small text-muted-foreground">Try a different search term or tag.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
