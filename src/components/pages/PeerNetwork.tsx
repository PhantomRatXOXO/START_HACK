import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  Calendar,
  ArrowUpRight,
} from "lucide-react"

interface Peer {
  id: string
  name: string
  initials: string
  university: string
  field: string
  topic: string
  stage: string
  stageLabel: string
  sharedInterests: string[]
  status: "current" | "alumni"
  completedYear?: string
  matchScore: number
}

const MOCK_PEERS: Peer[] = [
  {
    id: "1",
    name: "Lena M.",
    initials: "LM",
    university: "ETH Zurich",
    field: "Data Science & AI",
    topic: "Bias Detection in Large Language Models for Hiring Platforms",
    stage: "execution",
    stageLabel: "Conducting research",
    sharedInterests: ["AI", "NLP", "Ethics"],
    status: "current",
    matchScore: 92,
  },
  {
    id: "2",
    name: "Jonas K.",
    initials: "JK",
    university: "University of St. Gallen",
    field: "Business & Economics",
    topic: "The Impact of AI-Driven Matching on Graduate Employment Outcomes",
    stage: "writing",
    stageLabel: "Writing & finalizing",
    sharedInterests: ["AI", "HR Tech", "Labor Markets"],
    status: "current",
    matchScore: 87,
  },
  {
    id: "3",
    name: "Sara R.",
    initials: "SR",
    university: "University of Zurich",
    field: "Computer Science",
    topic: "Knowledge Graph Construction from Unstructured Academic Text",
    stage: "planning",
    stageLabel: "Planning",
    sharedInterests: ["NLP", "Knowledge Graphs"],
    status: "current",
    matchScore: 84,
  },
  {
    id: "4",
    name: "Marco T.",
    initials: "MT",
    university: "EPFL",
    field: "Engineering",
    topic: "Scalable Recommendation Systems for Academic-Industry Matching",
    stage: "execution",
    stageLabel: "Conducting research",
    sharedInterests: ["ML", "Recommender Systems"],
    status: "current",
    matchScore: 79,
  },
  {
    id: "5",
    name: "Anna W.",
    initials: "AW",
    university: "University of Bern",
    field: "Social Sciences",
    topic: "Student Decision-Making in Thesis Topic Selection: A Mixed-Methods Study",
    stage: "writing",
    stageLabel: "Writing & finalizing",
    sharedInterests: ["Research Methods", "EdTech"],
    status: "alumni",
    completedYear: "2025",
    matchScore: 76,
  },
  {
    id: "6",
    name: "David L.",
    initials: "DL",
    university: "ETH Zurich",
    field: "Data Science & AI",
    topic: "Automated Literature Review Summarization Using Transformer Models",
    stage: "writing",
    stageLabel: "Completed",
    sharedInterests: ["NLP", "AI", "Automation"],
    status: "alumni",
    completedYear: "2025",
    matchScore: 91,
  },
  {
    id: "7",
    name: "Chiara B.",
    initials: "CB",
    university: "University of St. Gallen",
    field: "Business & Economics",
    topic: "Platform Business Models in Higher Education: A Comparative Analysis",
    stage: "writing",
    stageLabel: "Completed",
    sharedInterests: ["Platform Economics", "EdTech"],
    status: "alumni",
    completedYear: "2024",
    matchScore: 72,
  },
  {
    id: "8",
    name: "Fabian H.",
    initials: "FH",
    university: "ZHAW",
    field: "Computer Science",
    topic: "Privacy-Preserving Student Profile Matching with Federated Learning",
    stage: "writing",
    stageLabel: "Completed",
    sharedInterests: ["Privacy", "ML", "EdTech"],
    status: "alumni",
    completedYear: "2024",
    matchScore: 68,
  },
    {
    id: "9",
    name: "Fabian H.",
    initials: "FH",
    university: "ZHAW",
    field: "Computer Science",
    topic: "Privacy-Preserving Student Profile Matching with Federated Learning",
    stage: "writing",
    stageLabel: "Completed",
    sharedInterests: ["Privacy", "ML", "EdTech"],
    status: "alumni",
    completedYear: "2024",
    matchScore: 68,
  },
    {
    id: "10",
    name: "Fabian H.",
    initials: "FH",
    university: "ZHAW",
    field: "Computer Science",
    topic: "Privacy-Preserving Student Profile Matching with Federated Learning",
    stage: "writing",
    stageLabel: "Completed",
    sharedInterests: ["Privacy", "ML", "EdTech"],
    status: "alumni",
    completedYear: "2024",
    matchScore: 68,
  },
]

/* ── Left-panel list item (compact) ── */
function PeerListItem({
  peer,
  isSelected,
  onClick,
}: {
  peer: Peer
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
          <div className="flex items-center gap-3 min-w-0">
            <Avatar>
              <AvatarFallback className="text-xs">{peer.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="ds-title-cards truncate">{peer.name}</CardTitle>
              <div className="ds-caption text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{peer.university}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-ai ds-badge font-semibold">{peer.matchScore}%</span>
            <div className="ds-caption text-muted-foreground">match</div>
          </div>
        </div>

        <p className="ds-caption font-medium leading-snug mt-1.5 line-clamp-2">{peer.topic}</p>

        <div className="flex flex-wrap gap-1 mt-1.5">
          {peer.sharedInterests.map((interest) => (
            <Badge key={interest} variant="outline" className="ds-caption text-[10px] px-1.5 py-0">
              {interest}
            </Badge>
          ))}
        </div>
      </CardHeader>
    </Card>
  )
}

/* ── Right-panel detail view (sticky) ── */
function PeerDetail({ peer }: { peer: Peer }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{peer.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="ds-title-cards text-lg">{peer.name}</CardTitle>
            <div className="ds-small text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3" />
              {peer.university}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-ai text-xl font-bold">{peer.matchScore}%</span>
          <span className="ds-small text-muted-foreground">match score</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <GraduationCap className="size-3" />
            {peer.field}
          </Badge>
          <Badge variant="outline">
            {peer.status === "alumni" ? (
              <>
                <Calendar className="size-3" />
                {peer.completedYear}
              </>
            ) : (
              peer.stageLabel
            )}
          </Badge>
        </div>

        <Separator />

        <div>
          <div className="ds-small text-muted-foreground mb-1 flex items-center gap-1">
            <BookOpen className="size-3" />
            Thesis topic
          </div>
          <p className="ds-small font-medium leading-snug">{peer.topic}</p>
        </div>

        <div>
          <div className="ds-small text-muted-foreground mb-1 flex items-center gap-1">
            <BookOpen className="size-3" />
            Description
          </div>
          <p className="ds-small text-muted-foreground leading-relaxed">
            This thesis explores {peer.topic.toLowerCase()} within the field of {peer.field.toLowerCase()}.
          </p>
        </div>

        <Separator />

        <div>
          <div className="ds-small text-muted-foreground mb-2">Shared interests</div>
          <div className="flex flex-wrap gap-1.5">
            {peer.sharedInterests.map((interest) => (
              <Badge key={interest} variant="outline" className="ds-caption">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            <MessageSquare className="size-4" />
            Message
          </Button>
          <Button size="sm" className="flex-1 rounded-full">
            <ArrowUpRight className="size-4" />
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PeerNetwork() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("current")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = MOCK_PEERS.filter((p) => {
    const matchesTab = tab === "all" || p.status === tab
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase()) ||
      p.field.toLowerCase().includes(search.toLowerCase()) ||
      p.sharedInterests.some((i) =>
        i.toLowerCase().includes(search.toLowerCase())
      )
    return matchesTab && matchesSearch
  })

  const selectedPeer =
    filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null

  const listRef = useRef<HTMLDivElement>(null)

  const selectByOffset = useCallback((offset: number) => {
    if (filtered.length === 0) return
    const currentIdx = filtered.findIndex((p) => p.id === selectedPeer?.id)
    const nextIdx = Math.max(0, Math.min(filtered.length - 1, currentIdx + offset))
    const nextPeer = filtered[nextIdx]
    setSelectedId(nextPeer.id)
    // scroll the card fully into view after render
    requestAnimationFrame(() => {
      const container = listRef.current
      if (!container) return
      const card = container.children[nextIdx] as HTMLElement | undefined
      if (!card) return
      const containerRect = container.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      if (cardRect.bottom > containerRect.bottom) {
        container.scrollBy({ top: cardRect.bottom - containerRect.bottom + 8, behavior: "smooth" })
      } else if (cardRect.top < containerRect.top) {
        container.scrollBy({ top: cardRect.top - containerRect.top - 8, behavior: "smooth" })
      }
    })
  }, [filtered, selectedPeer])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        selectByOffset(1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        selectByOffset(-1)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectByOffset])

  const currentCount = MOCK_PEERS.filter((p) => p.status === "current").length
  const alumniCount = MOCK_PEERS.filter((p) => p.status === "alumni").length

  return (
    <div>
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="ds-title-lg mb-1">Peer Network</h1>
        <p className="ds-body text-muted-foreground">
          Connect with students working on related topics — current and past.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="alumni">Alumni</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="ds-caption text-muted-foreground">
            {MOCK_PEERS.length} peers · {currentCount} active · {alumniCount} alumni
          </span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, topic, field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Split view */}
      {filtered.length > 0 ? (
        <div className="flex gap-6 ">
          {/* Left: scrollable peer list */}
          <div className="w-full md:w-2/5">
            <div ref={listRef} className="peer-scroll max-h-[70vh] overflow-y-auto p-2 pr-2 space-y-2">
              {filtered.map((peer) => (
                <PeerListItem
                  key={peer.id}
                  peer={peer}
                  isSelected={selectedPeer?.id === peer.id}
                  onClick={() => setSelectedId(peer.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: detail panel, stays in place */}
          {selectedPeer && (
            <div className="hidden md:block md:w-3/5">
              <div className="peer-scroll max-h-[70vh] overflow-y-auto">
                <PeerDetail peer={selectedPeer} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 size-10 text-muted-foreground" />
          <p className="ds-title-sm text-muted-foreground">No peers found</p>
          <p className="ds-small text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
