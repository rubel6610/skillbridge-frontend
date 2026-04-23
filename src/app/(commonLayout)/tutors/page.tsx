// app/browse-tutors/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  CalendarDays, Clock3, LoaderCircle, Mail, MapPin,
  MessageSquare, Search, ShieldCheck, Star, Wallet,
  X, BookOpen, Calculator, FlaskConical, Globe, Music,
  Code2, Palette, Dumbbell, Languages, SlidersHorizontal,
  ThumbsUp, Award, ChevronDown, User, Briefcase, GraduationCap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/* ─── Types ─── */
type AvailabilitySlot = {
  id?: number
  dayOfWeek: number
  startTime: string
  endTime: string
}

type Review = {
  id: number
  studentName: string
  rating: number
  comment: string
  date: string
}

type TutorProfile = {
  id: number
  bio: string
  hourlyRate: number
  experience: number
  location: string
  imageUrl: string | null
  isApproved: boolean
  avgRating: number
  totalReviews: number
  subjects?: string[]
  user: { id: number; name: string; email: string }
  availability?: AvailabilitySlot[]
  reviews?: Review[]
}

type ApiResponse<T> = { success: boolean; message: string; data: T }

/* ─── Constants ─── */
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DURATION_OPTIONS = [
  { label: '30 minutes', value: '30' },
  { label: '60 minutes', value: '60' },
  { label: '90 minutes', value: '90' },
  { label: '120 minutes', value: '120' },
]

const SUBJECTS = [
  { key: 'all', label: 'All Subjects', icon: BookOpen, color: 'text-gray-600' },
  { key: 'math', label: 'Mathematics', icon: Calculator, color: 'text-blue-600' },
  { key: 'science', label: 'Science', icon: FlaskConical, color: 'text-green-600' },
  { key: 'languages', label: 'Languages', icon: Languages, color: 'text-amber-600' },
  { key: 'coding', label: 'Programming', icon: Code2, color: 'text-purple-600' },
  { key: 'history', label: 'History', icon: Globe, color: 'text-red-600' },
  { key: 'music', label: 'Music', icon: Music, color: 'text-pink-600' },
  { key: 'art', label: 'Art & Design', icon: Palette, color: 'text-orange-600' },
  { key: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'text-emerald-600' },
]

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'reviews', label: 'Most Reviews' },
]

const PRICE_RANGES = [
  { min: 0, max: 50, label: '$0 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 150, label: '$100 - $150' },
  { min: 150, max: 200, label: '$150 - $200' },
  { min: 200, max: 500, label: '$200+' },
]

const MOCK_REVIEWS: Review[] = [
  { id: 1, studentName: 'Aisha Rahman', rating: 5, comment: 'Absolutely brilliant. Explained concepts I had struggled with for months in just one session. Cannot recommend highly enough!', date: '2024-11-20' },
  { id: 2, studentName: 'James Okonkwo', rating: 5, comment: 'Patient, knowledgeable, and engaging. My exam scores improved significantly after just four sessions.', date: '2024-11-05' },
  { id: 3, studentName: 'Priya Mehta', rating: 4, comment: 'Great tutor who adapts well to your learning style. Sometimes runs a little over time but that just means you get extra value!', date: '2024-10-28' },
  { id: 4, studentName: 'Lucas Fernandez', rating: 5, comment: 'One of the best tutors I have had. Clear explanations, great resources, and genuinely supportive.', date: '2024-10-14' },
  { id: 5, studentName: 'Chloe Ng', rating: 4, comment: 'Very knowledgeable. Would have liked more practice exercises but overall an excellent experience.', date: '2024-09-30' },
]

const SUBJECT_POOLS = [
  ['Mathematics', 'Calculus', 'Statistics'],
  ['Physics', 'Chemistry', 'Biology'],
  ['English', 'Spanish', 'French'],
  ['Python', 'JavaScript', 'Data Science'],
  ['World History', 'Geography', 'Social Studies'],
  ['Piano', 'Guitar', 'Music Theory'],
  ['Drawing', 'Graphic Design', 'Photography'],
  ['Fitness', 'Yoga', 'Nutrition'],
]

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-cyan-600',
]

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  all: [],
  math: ['math', 'mathematics', 'calculus', 'statistics', 'algebra', 'geometry'],
  science: ['science', 'physics', 'chemistry', 'biology'],
  languages: ['language', 'english', 'spanish', 'french'],
  coding: ['programming', 'python', 'javascript', 'java', 'data science', 'coding'],
  history: ['history', 'geography', 'social studies'],
  music: ['music', 'piano', 'guitar', 'theory'],
  art: ['art', 'design', 'drawing', 'photography'],
  fitness: ['fitness', 'yoga', 'nutrition'],
}

/* ─── Helper Functions ─── */
const formatAvail = (slots: AvailabilitySlot[] = []) => {
  if (!slots.length) return 'Schedule TBD'
  return slots.slice(0, 2).map(s => `${DAY_SHORT[s.dayOfWeek]} ${s.startTime}–${s.endTime}`).join(' · ')
}

const getSubjectStyle = (subject: string) => {
  const l = subject.toLowerCase()
  if (l.includes('math') || l.includes('calc') || l.includes('stat')) 
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  if (l.includes('phys') || l.includes('chem') || l.includes('bio')) 
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
  if (l.includes('english') || l.includes('spanish') || l.includes('french')) 
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  if (l.includes('python') || l.includes('java') || l.includes('data')) 
    return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  if (l.includes('history') || l.includes('geo')) 
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  if (l.includes('music') || l.includes('piano') || l.includes('guitar')) 
    return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
  if (l.includes('art') || l.includes('design') || l.includes('draw')) 
    return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
  return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
}

const matchesSubjectFilter = (tutor: TutorProfile, subjectKey: string) => {
  if (subjectKey === 'all') {
    return true
  }

  const keywords = SUBJECT_KEYWORDS[subjectKey] || []
  const searchableText = [...(tutor.subjects || []), tutor.bio]
    .join(' ')
    .toLowerCase()

  return keywords.some((keyword) => searchableText.includes(keyword))
}

/* ─── Sub-components ─── */
const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
      />
    ))}
  </div>
)

const Avatar = ({ tutor, size = 56 }: { tutor: TutorProfile; size?: number }) => {
  const gradient = GRADIENTS[tutor.id % GRADIENTS.length]
  const initials = tutor.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (tutor.imageUrl) {
    return (
      <img
        src={tutor.imageUrl}
        alt={tutor.user.name}
        className={`rounded-full object-cover flex-shrink-0`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

const SubjectTag = ({ subject }: { subject: string }) => {
  const style = getSubjectStyle(subject)
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} ${style.border} border`}>
      {subject}
    </span>
  )
}

/* ─── Main Component ─── */
const BrowseTutor = () => {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const { user, token } = useAuth()

  const [tutors, setTutors] = useState<TutorProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null)
  const [profileTutor, setProfileTutor] = useState<TutorProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSubject, setActiveSubject] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filters, setFilters] = useState({ minRating: 0, maxPrice: 500, minExp: 0 })
  const [bookingForm, setBookingForm] = useState({ scheduledAt: '', duration: '60', note: '' })

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const res = await fetch(`${baseUrl}/tutors`, { cache: 'no-store' })
        const result: ApiResponse<TutorProfile[]> = await res.json()
        if (!res.ok) throw new Error(result.message)
        const data = (Array.isArray(result.data) ? result.data : []).map((t, i) => ({
          ...t,
          subjects: SUBJECT_POOLS[i % SUBJECT_POOLS.length],
          reviews: MOCK_REVIEWS.slice(0, 2 + (i % 4)),
        }))
        setTutors(data)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load tutors'
        await Swal.fire({ icon: 'error', title: 'Unable to load tutors', text: msg, confirmButtonColor: '#6366f1' })
      } finally {
        setIsLoading(false)
      }
    }
    loadTutors()
  }, [baseUrl])

  const filteredTutors = useMemo(() => {
    let list = [...tutors]

    // Search filter
    const term = searchTerm.trim().toLowerCase()
    if (term) {
      list = list.filter(t =>
        [t.user.name, t.user.email, t.location, t.bio, ...(t.subjects || [])]
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    }

    // Subject filter
    if (activeSubject !== 'all') {
      list = list.filter(t => matchesSubjectFilter(t, activeSubject))
    }

    // Rating, price, experience filters
    list = list.filter(
      t =>
        t.avgRating >= filters.minRating &&
        t.hourlyRate <= filters.maxPrice &&
        t.experience >= filters.minExp
    )

    // Sorting
    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'price_low':
        list.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case 'price_high':
        list.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case 'experience':
        list.sort((a, b) => b.experience - a.experience)
        break
      case 'reviews':
        list.sort((a, b) => b.totalReviews - a.totalReviews)
        break
    }

    return list
  }, [tutors, searchTerm, activeSubject, sortBy, filters])

  const openBookingModal = async (tutor: TutorProfile) => {
    setProfileTutor(null)
    if (!user || !token) {
      await Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please sign in as a student to book sessions.',
        confirmButtonColor: '#6366f1',
      })
      router.push('/login')
      return
    }
    if (user.role !== 'STUDENT') {
      await Swal.fire({
        icon: 'warning',
        title: 'Students Only',
        text: 'Only students can book tutoring sessions.',
        confirmButtonColor: '#6366f1',
      })
      return
    }
    setSelectedTutor(tutor)
  }

  const handleBooking = async () => {
    if (!selectedTutor) return
    if (!bookingForm.scheduledAt) {
      await Swal.fire({
        icon: 'warning',
        title: 'Select Date & Time',
        text: 'Please choose a date and time for your session.',
        confirmButtonColor: '#6366f1',
      })
      return
    }

    setIsBooking(true)
    try {
      const res = await fetch(`${baseUrl}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorProfileId: selectedTutor.id,
          scheduledAt: bookingForm.scheduledAt,
          duration: Number(bookingForm.duration),
          note: bookingForm.note.trim(),
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      await Swal.fire({
        icon: 'success',
        title: 'Session Booked!',
        text: result.message || `Your session with ${selectedTutor.user.name} has been confirmed.`,
        confirmButtonColor: '#6366f1',
      })
      setSelectedTutor(null)
      setBookingForm({ scheduledAt: '', duration: '60', note: '' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Booking failed'
      await Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: msg,
        confirmButtonColor: '#6366f1',
      })
    } finally {
      setIsBooking(false)
    }
  }

  const resetFilters = () => {
    setFilters({ minRating: 0, maxPrice: 500, minExp: 0 })
    setActiveSubject('all')
    setSearchTerm('')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading expert tutors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
       
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search tutors, subjects, or locations..."
                  className="w-full pl-9 pr-8 py-2 border border-amber-200 rounded-xl bg-amber-50/50 focus:bg-white focus:border-indigo-400 focus:outline-none transition-colors text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-sm border border-amber-200 rounded-lg bg-white focus:border-indigo-400 focus:outline-none"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Subject Chips */}
      <div className="border-b border-amber-200 bg-white/50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {SUBJECTS.map(subject => {
              const Icon = subject.icon
              const isActive = activeSubject === subject.key
              return (
                <button
                  key={subject.key}
                  onClick={() => setActiveSubject(subject.key)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-amber-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : subject.color}`} />
                  {subject.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`w-72 flex-shrink-0 transition-all duration-300 ${
              sidebarOpen ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="bg-white rounded-2xl border border-amber-200 p-5 sticky top-32">
              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[0, 3, 3.5, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(f => ({ ...f, minRating: rating }))}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition ${
                        filters.minRating === rating
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {rating === 0 ? 'Any rating' : <Stars rating={rating} size={12} />}
                        {rating > 0 && ` ${rating}+ stars`}
                      </span>
                      <span className="text-xs text-gray-400">
                        {tutors.filter(t => t.avgRating >= rating).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-amber-100 my-4" />

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Hourly Rate
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Max price:</span>
                    <span className="font-semibold text-indigo-600">${filters.maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={10}
                    value={filters.maxPrice}
                    onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$10</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-100 my-4" />

              {/* Experience Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Experience
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Min years:</span>
                    <span className="font-semibold text-indigo-600">{filters.minExp}+ yrs</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={filters.minExp}
                    onChange={e => setFilters(f => ({ ...f, minExp: Number(e.target.value) }))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 yrs</span>
                    <span>20+ yrs</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-100 my-4" />

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Tutor Grid */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-serif text-2xl font-bold text-gray-800">
                {activeSubject === 'all' ? 'All Tutors' : SUBJECTS.find(s => s.key === activeSubject)?.label}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredTutors.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-amber-200">
                <div className="text-6xl mb-4 opacity-30">📚</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No tutors found</h2>
                <p className="text-gray-500">Try adjusting your filters or clearing your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTutors.map(tutor => (
                  <div
                    key={tutor.id}
                    className="group bg-white rounded-2xl border border-amber-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                  >
                    {/* Colored top bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${GRADIENTS[tutor.id % GRADIENTS.length]}`} />

                    <div className="p-5">
                      {/* Header with avatar and rate */}
                      <div className="flex gap-3 mb-4">
                        <Avatar tutor={tutor} size={56} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-lg text-gray-800 truncate">
                            {tutor.user.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{tutor.location}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs text-emerald-600 font-medium">Verified</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif font-bold text-xl text-indigo-600">${tutor.hourlyRate}</div>
                          <div className="text-xs text-gray-400">/hour</div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <Stars rating={tutor.avgRating} />
                        <span className="text-sm text-gray-600">
                          {tutor.avgRating.toFixed(1)} ({tutor.totalReviews} reviews)
                        </span>
                      </div>

                      {/* Subjects */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(tutor.subjects || []).slice(0, 3).map(subject => (
                          <SubjectTag key={subject} subject={subject} />
                        ))}
                        {(tutor.subjects?.length || 0) > 3 && (
                          <span className="text-xs text-gray-400">+{tutor.subjects!.length - 3} more</span>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tutor.bio}</p>

                      {/* Meta info */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-amber-50 rounded-xl mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Award className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{tutor.experience} yrs exp</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{tutor.totalReviews} reviews</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 col-span-2">
                          <Clock3 className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="truncate">{formatAvail(tutor.availability)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProfileTutor(tutor)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-amber-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                        >
                          <BookOpen className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => openBookingModal(tutor)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                        >
                          <CalendarDays className="w-4 h-4" />
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Tutor Profile Modal */}
      {profileTutor && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setProfileTutor(null)
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Cover */}
            <div className={`h-28 bg-gradient-to-r ${GRADIENTS[profileTutor.id % GRADIENTS.length]} relative`}>
              <div className="absolute -bottom-8 left-6">
                <Avatar tutor={profileTutor} size={72} />
              </div>
              <button
                onClick={() => setProfileTutor(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="pt-10 px-6 pb-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-800">{profileTutor.user.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profileTutor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Stars rating={profileTutor.avgRating} />
                    <span className="text-sm text-gray-600">
                      {profileTutor.avgRating.toFixed(1)} · {profileTutor.totalReviews} reviews
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-indigo-600">${profileTutor.hourlyRate}</div>
                  <div className="text-sm text-gray-400">per hour</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Experience', value: `${profileTutor.experience} yrs` },
                  { label: 'Rating', value: profileTutor.avgRating.toFixed(1) },
                  { label: 'Reviews', value: profileTutor.totalReviews },
                  { label: 'Subjects', value: (profileTutor.subjects || []).length },
                ].map(stat => (
                  <div key={stat.label} className="bg-amber-50 rounded-xl p-3 text-center">
                    <div className="font-serif text-xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed mb-5">{profileTutor.bio}</p>

              {/* Subjects */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {(profileTutor.subjects || []).map(subject => (
                  <SubjectTag key={subject} subject={subject} />
                ))}
              </div>

              {/* Availability */}
              {(profileTutor.availability || []).length > 0 && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Availability</h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(profileTutor.availability || []).map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700">
                        <Clock3 className="w-3.5 h-3.5" />
                        {DAY_LABELS[slot.dayOfWeek]} {slot.startTime}–{slot.endTime}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Reviews */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Student Reviews</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-5">
                {(profileTutor.reviews || MOCK_REVIEWS.slice(0, 3)).map(review => (
                  <div key={review.id} className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {review.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-semibold text-gray-800">{review.studentName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Stars rating={review.rating} size={12} />
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-amber-100">
                <button
                  onClick={() => setProfileTutor(null)}
                  className="flex-1 px-4 py-2.5 border border-amber-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => openBookingModal(profileTutor)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                >
                  <CalendarDays className="w-4 h-4" />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedTutor && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedTutor(null)
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-amber-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-800">Book with {selectedTutor.user.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">Complete the details to confirm your session.</p>
                </div>
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Form */}
                <div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Session Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={bookingForm.scheduledAt}
                      onChange={e => setBookingForm(c => ({ ...c, scheduledAt: e.target.value }))}
                      className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Duration
                    </label>
                    <select
                      value={bookingForm.duration}
                      onChange={e => setBookingForm(c => ({ ...c, duration: e.target.value }))}
                      className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                    >
                      {DURATION_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Session Note
                    </label>
                    <textarea
                      rows={4}
                      value={bookingForm.note}
                      onChange={e => setBookingForm(c => ({ ...c, note: e.target.value }))}
                      placeholder="Share your goals, topics, or what you need help with..."
                      className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:border-indigo-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-amber-50 rounded-xl p-5 h-fit">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Summary</h3>
                  <div className="font-serif text-lg font-bold text-gray-800 mb-3 pb-3 border-b border-amber-200">
                    {selectedTutor.user.name}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Wallet className="w-4 h-4 text-indigo-500" />
                      <span>${selectedTutor.hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span>{selectedTutor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      <span>{selectedTutor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>{selectedTutor.avgRating.toFixed(1)} · {selectedTutor.totalReviews} reviews</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Estimated Total</div>
                    <div className="font-serif text-2xl font-bold text-indigo-600">
                      ${((selectedTutor.hourlyRate / 60) * Number(bookingForm.duration)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-amber-100">
              <button
                onClick={() => setSelectedTutor(null)}
                disabled={isBooking}
                className="px-5 py-2.5 border border-amber-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseTutor
