// app/browse-tutors/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  X,
  ChevronRight,
  TrendingUp,
  Filter,
  Calculator,
  Code2,
  Languages,
  FlaskConical,
  Palette,
  Music,
  Dumbbell,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// Types
type AvailabilitySlot = {
  id?: number
  dayOfWeek: number
  startTime: string
  endTime: string
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
}

type ApiResponse<T> = { success: boolean; message: string; data: T }

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const durationOptions = [
  { label: '30 minutes', value: '30' },
  { label: '60 minutes', value: '60' },
  { label: '90 minutes', value: '90' },
  { label: '120 minutes', value: '120' },
]

// Subject categories for sidebar
const SUBJECT_CATEGORIES = [
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'programming', label: 'Programming', icon: Code2 },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'art', label: 'Art & Design', icon: Palette },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
]

// Helper functions
const formatAvailability = (slots: AvailabilitySlot[] = []) => {
  if (!slots.length) return 'Schedule TBD'
  return slots.slice(0, 2).map(s => `${dayLabels[s.dayOfWeek]} ${s.startTime}–${s.endTime}`).join(' · ')
}

const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={size}
        className={i <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
      />
    ))}
  </div>
)

const TutorAvatar = ({ tutor }: { tutor: TutorProfile }) => {
  const initials = tutor.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const gradients = [
    'from-violet-400 to-fuchsia-400',
    'from-cyan-400 to-blue-400',
    'from-emerald-400 to-teal-400',
    'from-orange-400 to-rose-400',
    'from-indigo-400 to-purple-400',
  ]
  const gradient = gradients[tutor.id % gradients.length]

  return tutor.imageUrl ? (
    <img src={tutor.imageUrl} alt={tutor.user.name} className="h-full w-full object-cover rounded-2xl" />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} rounded-2xl`}>
      <span className="text-xl font-bold text-white">{initials}</span>
    </div>
  )
}

// Mock subjects for demo
const mockSubjects: Record<number, string[]> = {
  1: ['Mathematics', 'Programming', 'Data Science'],
  2: ['Science', 'Mathematics', 'Physics'],
  3: ['Languages', 'Business English', 'Spanish'],
  4: ['Art', 'Music', 'Drawing'],
  5: ['Fitness', 'Yoga', 'Nutrition'],
  6: ['Programming', 'Web Development', 'Python'],
  7: ['Business', 'Marketing', 'Leadership'],
  8: ['Music', 'Piano', 'Guitar'],
}

export default function BrowseTutor() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const { user, token } = useAuth()

  const [tutors, setTutors] = useState<TutorProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null)
  const [bookingForm, setBookingForm] = useState({ scheduledAt: '', duration: '60', note: '' })

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`${baseUrl}/tutors`, { cache: 'no-store' })
        const result: ApiResponse<TutorProfile[]> = await res.json()
        if (!res.ok) throw new Error(result.message || 'Failed to load tutors')
        let data = Array.isArray(result.data) ? result.data : []
        data = data.map(t => ({ ...t, subjects: t.subjects || mockSubjects[t.id] || ['General'] }))
        setTutors(data)
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to load tutors'
        await Swal.fire({ icon: 'error', title: 'Unable to load tutors', text: msg, confirmButtonColor: '#6366f1' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTutors()
  }, [baseUrl])

  const filteredTutors = useMemo(() => {
    let filtered = [...tutors]
    const term = searchTerm.trim().toLowerCase()
    if (term) {
      filtered = filtered.filter(t =>
        [t.user.name, t.user.email, t.location, t.bio, ...(t.subjects || [])]
          .join(' ').toLowerCase().includes(term)
      )
    }
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(t =>
        t.subjects?.some(subj => selectedSubjects.includes(subj))
      )
    }
    if (minRating > 0) {
      filtered = filtered.filter(t => t.avgRating >= minRating)
    }
    return filtered
  }, [tutors, searchTerm, selectedSubjects, minRating])

  const openBookingModal = async (tutor: TutorProfile) => {
    if (!user || !token) {
      await Swal.fire({ icon: 'info', title: 'Login required', text: 'Please sign in as a student.', confirmButtonColor: '#6366f1' })
      router.push('/login')
      return
    }
    if (user.role !== 'STUDENT') {
      await Swal.fire({ icon: 'warning', title: 'Student account required', text: 'Only students can book tutors.', confirmButtonColor: '#6366f1' })
      return
    }
    setSelectedTutor(tutor)
  }

  const handleBooking = async () => {
    if (!selectedTutor) return
    if (!bookingForm.scheduledAt) {
      await Swal.fire({ icon: 'warning', title: 'Choose a time', text: 'Please select date and time.', confirmButtonColor: '#6366f1' })
      return
    }
    setIsBooking(true)
    try {
      const res = await fetch(`${baseUrl}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tutorProfileId: selectedTutor.id,
          scheduledAt: bookingForm.scheduledAt,
          duration: Number(bookingForm.duration),
          note: bookingForm.note.trim(),
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Booking failed')
      await Swal.fire({ icon: 'success', title: 'Booked!', text: result.message || `Session with ${selectedTutor.user.name} confirmed.`, confirmButtonColor: '#6366f1' })
      setSelectedTutor(null)
      setBookingForm({ scheduledAt: '', duration: '60', note: '' })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Booking failed'
      await Swal.fire({ icon: 'error', title: 'Booking failed', text: msg, confirmButtonColor: '#6366f1' })
    } finally {
      setIsBooking(false)
    }
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject])
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubjects([])
    setMinRating(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="border-b border-indigo-100 bg-white/70 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200 mb-4">
                <ShieldCheck size={12} />
                Verified Expert Tutors
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                Find your <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">perfect tutor</span>
              </h1>
              <p className="mt-4 text-gray-500 max-w-xl">
                Browse verified educators, compare expertise, and book a session — all in one seamless experience.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white border border-indigo-200 px-4 py-2 shadow-sm">
                <div className="text-xs text-gray-500">Available tutors</div>
                <div className="text-2xl font-bold text-gray-800">{filteredTutors.length}</div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0 space-y-6`}>
            {/* Search Box */}
            <div className="rounded-2xl bg-white border border-indigo-100 p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search size={16} className="text-indigo-500" />
                Search tutors
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, subject, location..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Subject Categories */}
            <div className="rounded-2xl bg-white border border-indigo-100 p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                Subjects
              </h3>
              <div className="space-y-2">
                {SUBJECT_CATEGORIES.map((subject) => {
                  const Icon = subject.icon
                  const isActive = selectedSubjects.includes(subject.label)
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.label)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-indigo-500' : 'text-gray-400'} />
                      <span className="flex-1 text-left">{subject.label}</span>
                      {isActive && <X size={14} className="text-indigo-400" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="rounded-2xl bg-white border border-indigo-100 p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                Minimum Rating
              </h3>
              <div className="space-y-2">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all ${
                      minRating === rating
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {rating === 0 ? 'Any rating' : <StarRating rating={rating} size={12} />}
                      {rating > 0 && ` ${rating}+ stars`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tutors.filter(t => t.avgRating >= rating).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedSubjects.length > 0 || minRating > 0) && (
              <button
                onClick={clearFilters}
                className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Tutors Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm">
                  <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500" />
                  <span className="text-gray-600">Loading tutors...</span>
                </div>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="rounded-2xl border border-indigo-100 bg-white p-12 text-center shadow-sm">
                <div className="text-6xl mb-4 opacity-50">📚</div>
                <h3 className="text-xl font-semibold text-gray-700">No tutors found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredTutors.map((tutor) => {
                  const estimatedPrice = (tutor.hourlyRate / 60) * 60
                  return (
                    <div
                      key={tutor.id}
                      className="group relative rounded-2xl border border-indigo-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-indigo-300"
                    >
                      {/* Top gradient bar */}
                      <div className={`h-1.5 rounded-t-2xl bg-gradient-to-r ${
                        ['from-violet-400 to-fuchsia-400', 'from-cyan-400 to-blue-400', 'from-emerald-400 to-teal-400', 'from-orange-400 to-rose-400', 'from-indigo-400 to-purple-400'][tutor.id % 5]
                      }`} />

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm">
                            <TutorAvatar tutor={tutor} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-xl font-bold text-gray-800">{tutor.user.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin size={12} />
                              <span>{tutor.location}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                              <ShieldCheck size={12} className="text-emerald-600" />
                              <span className="text-xs text-emerald-600">Verified</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">${tutor.hourlyRate}</div>
                            <div className="text-xs text-gray-400">/hour</div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                          <StarRating rating={tutor.avgRating} />
                          <span className="text-xs text-gray-500">
                            {tutor.avgRating.toFixed(1)} ({tutor.totalReviews} reviews)
                          </span>
                        </div>

                        {/* Subjects */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(tutor.subjects || []).slice(0, 3).map(sub => (
                            <span key={sub} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {sub}
                            </span>
                          ))}
                          {(tutor.subjects?.length || 0) > 3 && (
                            <span className="text-xs text-gray-400">+{tutor.subjects!.length - 3}</span>
                          )}
                        </div>

                        {/* Bio */}
                        <p className="mt-3 line-clamp-2 text-sm text-gray-600">{tutor.bio}</p>

                        {/* Meta row */}
                        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-2 text-center text-xs">
                          <div>
                            <div className="text-gray-400">Exp.</div>
                            <div className="font-semibold text-gray-700">{tutor.experience}y</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Rate</div>
                            <div className="font-semibold text-gray-700">${tutor.hourlyRate}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Reviews</div>
                            <div className="font-semibold text-gray-700">{tutor.totalReviews}</div>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock3 size={12} />
                          <span className="truncate">{formatAvailability(tutor.availability)}</span>
                        </div>

                        {/* Book button */}
                        <button
                          onClick={() => openBookingModal(tutor)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-200"
                        >
                          <CalendarDays size={16} />
                          Book session · ${estimatedPrice.toFixed(0)}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Booking Modal - Light Theme */}
      {selectedTutor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setSelectedTutor(null)}
        >
          <div className="w-full max-w-3xl rounded-2xl border border-indigo-100 bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-indigo-100 p-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-800">Book with {selectedTutor.user.name}</h2>
                <p className="text-sm text-gray-500">Complete the details to confirm your session</p>
              </div>
              <button onClick={() => setSelectedTutor(null)} className="rounded-lg p-1 hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.scheduledAt}
                    onChange={e => setBookingForm(f => ({ ...f, scheduledAt: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Duration</label>
                  <select
                    value={bookingForm.duration}
                    onChange={e => setBookingForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none"
                  >
                    {durationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Note (optional)</label>
                  <textarea
                    rows={4}
                    value={bookingForm.note}
                    onChange={e => setBookingForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="What would you like to learn?"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase text-gray-500">Summary</h3>
                <div className="font-serif text-xl font-bold text-gray-800">{selectedTutor.user.name}</div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wallet size={14} className="text-indigo-500" /> ${selectedTutor.hourlyRate}/hour
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-indigo-500" /> {selectedTutor.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star size={14} className="text-amber-500" /> {selectedTutor.avgRating.toFixed(1)} ({selectedTutor.totalReviews} reviews)
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-indigo-100 p-3">
                  <div className="text-xs uppercase text-indigo-700">Estimated total</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    ${((selectedTutor.hourlyRate / 60) * Number(bookingForm.duration)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-indigo-100 p-5">
              <button
                onClick={() => setSelectedTutor(null)}
                disabled={isBooking}
                className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {isBooking ? (
                  <><LoaderCircle size={16} className="animate-spin" /> Confirming...</>
                ) : (
                  <><CalendarDays size={16} /> Confirm Booking</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}