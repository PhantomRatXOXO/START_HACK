import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  GraduationCap,
  Building2,
  Users,
  ArrowUpRight,
  BookOpen,
  MapPin,
  TrendingUp,
  Mail,
  Send,
  Sparkles,
} from "lucide-react"

interface CourseMatch {
  id: string
  university: string
  program: string
  degree: "Bachelor" | "Master" | "PhD"
  field: string
  location: string
  students: number
  matchScore: number
  matchReasons: string[]
  director: string
  thesisTopicsAligned: number
  alignedTheses: string[]
  isPartner: boolean
  keywords: string[]
}

const MOCK_COURSES: CourseMatch[] = [
  {
    id: "1",
    university: "ETH Zurich",
    program: "MSc Computer Science",
    degree: "Master",
    field: "Computer Science",
    location: "Zurich",
    students: 320,
    matchScore: 96,
    matchReasons: ["AI/ML focus aligns with your topics", "Strong industry thesis culture", "Previous successful placements"],
    director: "Prof. Dr. M. Wegmann",
    thesisTopicsAligned: 12,
    alignedTheses: [
      "Bias Detection in LLM-Based Hiring Pipelines",
      "Scalable Feature Stores for Real-Time ML Inference",
      "Privacy-Preserving Federated Learning for HR Analytics",
      "Automated Resume Parsing with Transformer Architectures",
      "Knowledge Graph Construction for Talent Matching",
    ],
    isPartner: true,
    keywords: ["AI/ML", "NLP", "Data Engineering"],
  },
  {
    id: "2",
    university: "University of St. Gallen",
    program: "MSc Business Innovation",
    degree: "Master",
    field: "Business & Economics",
    location: "St. Gallen",
    students: 180,
    matchScore: 91,
    matchReasons: ["Innovation management curriculum", "Mandatory industry thesis", "Strong company network"],
    director: "Prof. Dr. A. Brenner",
    thesisTopicsAligned: 8,
    alignedTheses: [
      "Platform Business Models in Higher Education",
      "AI-Driven Matching and Graduate Employment Outcomes",
      "Corporate Innovation Labs: Success Factors and Metrics",
    ],
    isPartner: true,
    keywords: ["Innovation", "Platform Economics", "Strategy"],
  },
  {
    id: "3",
    university: "EPFL",
    program: "MSc Data Science",
    degree: "Master",
    field: "Data Science & AI",
    location: "Lausanne",
    students: 210,
    matchScore: 89,
    matchReasons: ["Data-intensive curriculum", "Cross-disciplinary projects", "Research-oriented students"],
    director: "Prof. Dr. K. Aberer",
    thesisTopicsAligned: 6,
    alignedTheses: [
      "Real-Time Anomaly Detection in Streaming Data Pipelines",
      "Graph Neural Networks for Academic Collaboration Prediction",
      "Causal Inference Methods for A/B Testing at Scale",
    ],
    isPartner: false,
    keywords: ["Data Science", "ML", "Statistics"],
  },
  {
    id: "4",
    university: "University of Zurich",
    program: "MSc Informatics",
    degree: "Master",
    field: "Computer Science",
    location: "Zurich",
    students: 240,
    matchScore: 85,
    matchReasons: ["Software engineering focus", "HCI specialization available", "Good industry integration"],
    director: "Prof. Dr. T. Fritz",
    thesisTopicsAligned: 5,
    alignedTheses: [
      "UX Patterns for AI-Assisted Decision Making",
      "Microservice Architecture for EdTech Platforms",
      "Accessibility in AI-Powered Interfaces",
    ],
    isPartner: true,
    keywords: ["HCI", "Software Engineering", "UX"],
  },
  {
    id: "5",
    university: "ZHAW",
    program: "BSc Computer Science",
    degree: "Bachelor",
    field: "Computer Science",
    location: "Winterthur",
    students: 280,
    matchScore: 82,
    matchReasons: ["Practice-oriented program", "Industry collaboration required", "Applied research focus"],
    director: "Prof. Dr. R. Steiger",
    thesisTopicsAligned: 4,
    alignedTheses: [
      "Building a REST API for Academic-Industry Matching",
      "Mobile-First Dashboard for Thesis Progress Tracking",
    ],
    isPartner: false,
    keywords: ["Applied CS", "Web Dev", "Mobile"],
  },
  {
    id: "6",
    university: "University of Bern",
    program: "MSc Economics",
    degree: "Master",
    field: "Business & Economics",
    location: "Bern",
    students: 150,
    matchScore: 78,
    matchReasons: ["Behavioral economics specialization", "Policy-oriented research", "Quantitative methods"],
    director: "Prof. Dr. F. Schlueter",
    thesisTopicsAligned: 3,
    alignedTheses: [
      "Nudging Students Toward Industry-Relevant Thesis Topics",
      "Economic Impact of University-Industry Thesis Programs",
    ],
    isPartner: false,
    keywords: ["Economics", "Behavioral Science", "Policy"],
  },
]

/* ── Left-panel list item (compact) ── */
function CourseListItem({
  course,
  isSelected,
  onClick,
}: {
  course: CourseMatch
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="ds-title-cards truncate">{course.university}</CardTitle>
            <div className="ds-caption text-muted-foreground truncate">{course.program}</div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-ai ds-badge font-semibold">{course.matchScore}%</span>
            <div className="ds-caption text-muted-foreground">match</div>
          </div>
        </div>

        <div className="ds-caption text-muted-foreground mt-1.5 flex items-center gap-1">
          <BookOpen className="size-3 shrink-0" />
          {course.thesisTopicsAligned} aligned topics
          {course.isPartner && (
            <Badge variant="secondary" className="text-ai-solid ml-auto ds-caption text-[10px] px-1.5 py-0">
              Partner
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-1.5">
          {course.keywords.map((kw) => (
            <Badge key={kw} variant="outline" className="ds-caption text-[10px] px-1.5 py-0">
              {kw}
            </Badge>
          ))}
        </div>
      </CardHeader>
    </Card>
  )
}

/* ── Right-panel detail view ── */
function CourseDetail({ course }: { course: CourseMatch }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="ds-title-cards text-lg">{course.university} — {course.program}</CardTitle>
            <div className="ds-small text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-3" />
              {course.location}
            </div>
          </div>
          {course.isPartner && (
            <Badge variant="secondary" className="text-ai-solid shrink-0">
              Partner
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-ai text-xl font-bold">{course.matchScore}%</span>
          <span className="ds-small text-muted-foreground">match score</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <GraduationCap className="size-3" />
            {course.degree}
          </Badge>
          <Badge variant="outline">
            <BookOpen className="size-3" />
            {course.field}
          </Badge>
          <Badge variant="outline">
            <Users className="size-3" />
            {course.students} students
          </Badge>
        </div>

        <Separator />

        <div>
          <div className="ds-small text-muted-foreground mb-1.5 flex items-center gap-1">
            <TrendingUp className="size-3" />
            Why this is a good match
          </div>
          <ul className="ds-small text-muted-foreground space-y-1">
            {course.matchReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-foreground mt-0.5">·</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <div className="ds-small text-muted-foreground mb-1.5 flex items-center gap-1">
            <BookOpen className="size-3" />
            Aligned thesis topics ({course.thesisTopicsAligned})
          </div>
          <ul className="ds-small space-y-1">
            {course.alignedTheses.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <Sparkles className="size-3 mt-0.5 shrink-0 text-ai-solid" />
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="ds-small text-muted-foreground">
          Program director: {course.director}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            <Mail className="size-4" />
            Contact director
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            <ArrowUpRight className="size-4" />
            View program
          </Button>
          <Button size="sm" className="flex-1 rounded-full">
            <Send className="size-4" />
            Export thesis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseSuggestions() {
  const [search, setSearch] = useState("")
  const [degreeFilter, setDegreeFilter] = useState<string>("all")
  const [fieldFilter, setFieldFilter] = useState<string>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = MOCK_COURSES.filter((c) => {
    const matchesDegree = degreeFilter === "all" || c.degree === degreeFilter
    const matchesField = fieldFilter === "all" || c.field === fieldFilter
    const matchesSearch =
      search === "" ||
      c.university.toLowerCase().includes(search.toLowerCase()) ||
      c.program.toLowerCase().includes(search.toLowerCase()) ||
      c.field.toLowerCase().includes(search.toLowerCase())
    return matchesDegree && matchesField && matchesSearch
  })

  const uniqueFields = [...new Set(MOCK_COURSES.map((c) => c.field))]

  const selectedCourse =
    filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null

  return (
    <div>
      {/* Header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-ai rounded-full">
            <Building2 className="size-3" />
            Company view
          </Badge>
        </div>
        <h1 className="ds-title-lg mb-1">Course Suggestions</h1>
        <p className="ds-body text-muted-foreground">
          University programs aligned with your published thesis topics. Find the right talent pipeline.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={degreeFilter} onValueChange={setDegreeFilter}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Degree level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Bachelor">Bachelor</SelectItem>
            <SelectItem value="Master">Master</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fieldFilter} onValueChange={setFieldFilter}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fields</SelectItem>
            {uniqueFields.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Split view */}
      {filtered.length > 0 ? (
        <div className="flex gap-6">
          {/* Left: scrollable course list */}
          <div className="w-full md:w-2/5">
            <div className="peer-scroll max-h-[70vh] overflow-y-auto p-2 pr-4 space-y-2">
              {filtered.map((course) => (
                <CourseListItem
                  key={course.id}
                  course={course}
                  isSelected={selectedCourse?.id === course.id}
                  onClick={() => setSelectedId(course.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: detail panel */}
          {selectedCourse && (
            <div className="hidden md:block md:w-3/5">
              <div className="peer-scroll max-h-[70vh] overflow-y-auto">
                <CourseDetail course={selectedCourse} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="mb-4 size-10 text-muted-foreground" />
          <p className="ds-title-sm text-muted-foreground">No programs found</p>
          <p className="ds-small text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}
