import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  isPartner: boolean
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
    isPartner: true,
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
    isPartner: true,
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
    isPartner: false,
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
    isPartner: true,
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
    isPartner: false,
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
    isPartner: false,
  },
]

function CourseCard({ course }: { course: CourseMatch }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="ds-title-cards">{course.program}</CardTitle>
              {course.isPartner && (
                <Badge variant="secondary" className="text-ai-solid">
                  Partner
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="size-3" />
              {course.university} — {course.location}
            </CardDescription>
          </div>
          <div className="text-right shrink-0">
            <span className="text-ai ds-title-sm font-semibold">{course.matchScore}%</span>
            <div className="ds-caption text-muted-foreground">match</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
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

        <div>
          <div className="ds-label text-muted-foreground mb-1 flex items-center gap-1">
            <Sparkles className="size-3" />
            Why this matches
          </div>
          <ul className="ds-small text-muted-foreground space-y-0.5">
            {course.matchReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <TrendingUp className="size-3 mt-1 shrink-0 text-foreground" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between ds-small text-muted-foreground">
          <span>{course.thesisTopicsAligned} aligned topics published</span>
          <span>Dir: {course.director}</span>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            <Mail className="size-4" />
            Contact director
          </Button>
          <Button size="sm" className="flex-1 rounded-full">
            <ArrowUpRight className="size-4" />
            View program
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-ai rounded-full">
            <Building2 className="size-3" />
            Company view
          </Badge>
        </div>
        <h1 className="ds-title-lg mb-1">Course Suggestions</h1>
        <p className="ds-body text-muted-foreground">
          University programs and courses aligned with your published thesis topics.
          Find the right talent pipeline.
        </p>
      </div>

      {/* AI insight */}
      <Card className="border-ai mb-6">
        <CardContent className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="ds-label mb-0.5">AI Recommendation</div>
            <p className="ds-small text-muted-foreground">
              Based on your 12 published topics in AI/ML and data engineering,
              we found <strong className="text-foreground">6 programs</strong> across
              Swiss universities with high alignment. Programs marked "Partner"
              already use Studyond for thesis matching.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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

      {/* Grid */}
      <div className="grid-3-col">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="mb-4 size-10 text-muted-foreground" />
          <p className="ds-title-sm text-muted-foreground">No programs found</p>
          <p className="ds-small text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}
