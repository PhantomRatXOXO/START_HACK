import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

interface Tip {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  isNew: boolean
}

interface Paper {
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

const PAPERS: Paper[] = [
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
]

const REVIEWS: Review[] = [
  {
    id: "1",
    studentName: "Maria S.",
    studentInitials: "MS",
    university: "University of St. Gallen",
    topic: "Digital Transformation in Swiss SMEs",
    rating: 5,
    text: "Finding my thesis topic through Studyond's company topics was a game-changer. Instead of spending weeks searching, I found a real business problem from Swiss Post within two days. My supervisor loved that I had a concrete partner from the start.",
    date: "Feb 2026",
    helpful: 24,
  },
  {
    id: "2",
    studentName: "Lukas B.",
    studentInitials: "LB",
    university: "ETH Zurich",
    topic: "ML Pipeline Optimization for Production Systems",
    rating: 4,
    text: "The matching engine suggested topics I wouldn't have found on my own. The company I worked with provided actual production data, which made my thesis significantly stronger than a purely academic one. Only downside: wish there was more support during the execution phase.",
    date: "Jan 2026",
    helpful: 18,
  },
  {
    id: "3",
    studentName: "Sophie K.",
    studentInitials: "SK",
    university: "EPFL",
    topic: "UX Research Methods for Educational Platforms",
    rating: 5,
    text: "As an international student, I had zero industry contacts in Switzerland. Studyond connected me with a design team at a startup and two interview partners for my qualitative research. Could not have done this alone.",
    date: "Dec 2025",
    helpful: 31,
  },
  {
    id: "4",
    studentName: "Tim W.",
    studentInitials: "TW",
    university: "University of Zurich",
    topic: "Behavioral Economics of Platform Adoption",
    rating: 4,
    text: "Good platform for finding a topic, but I really wished there was some kind of timeline planning tool. I completely underestimated how long data collection would take and had to rush the writing. A planning feature would have saved me.",
    date: "Nov 2025",
    helpful: 15,
  },
]

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

export function ThesisPrep() {
  const [completedTips, setCompletedTips] = useState<string[]>([])

  const toggleTip = (id: string) => {
    setCompletedTips((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

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

      <Tabs defaultValue="tips">
        {/* Tips */}
        <TabsContent value="tips">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="tips">
                <Lightbulb className="size-4" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="literature">
                <BookOpen className="size-4" />
                Literature
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
              <TabsTrigger value="tips">
                <Lightbulb className="size-4" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="literature">
                <BookOpen className="size-4" />
                Literature
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-3">
            {PAPERS.map((paper) => (
              <Card key={paper.id} className="transition-all duration-300 hover:shadow-md">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                        <span className="ds-title-cards">{paper.title}</span>
                      </div>
                      <p className="ds-small text-muted-foreground">
                        {paper.authors} ({paper.year}) — <em>{paper.journal}</em>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-ai ds-badge font-semibold">{paper.relevanceScore}%</span>
                      <div className="ds-caption text-muted-foreground">relevant</div>
                    </div>
                  </div>
                  <div className="ds-small text-muted-foreground flex items-start gap-1.5">
                    <Target className="size-3 mt-1 shrink-0" />
                    {paper.reason}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {paper.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="ds-caption">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <ArrowUpRight className="size-4" />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
