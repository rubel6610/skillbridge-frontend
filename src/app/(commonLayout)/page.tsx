"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

type TutorProfile = {
  id: number;
  bio: string;
  hourlyRate: number;
  experience: number;
  location: string;
  imageUrl: string | null;
  avgRating: number;
  totalReviews: number;
  user: { id: number; name: string; email: string };
  categories?: { categoryId: number; category: { id: number; name: string } }[];
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={12}
        className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
      />
    ))}
  </div>
);

const TutorAvatar = ({ tutor }: { tutor: TutorProfile }) => {
  const initials = tutor.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const gradients = [
    "from-violet-400 to-fuchsia-500",
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-rose-500",
    "from-indigo-400 to-purple-500",
  ];
  const gradient = gradients[tutor.id % gradients.length];
  return tutor.imageUrl ? (
    <img src={tutor.imageUrl} alt={tutor.user.name} className="h-full w-full object-cover" />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <span className="text-lg font-bold text-white">{initials}</span>
    </div>
  );
};

const steps = [
  { icon: Search, title: "Browse Tutors", desc: "Search by subject, rating, and price to find the perfect match." },
  { icon: CalendarDays, title: "Book a Session", desc: "Pick a time slot and book instantly — no back-and-forth needed." },
  { icon: BookOpen, title: "Learn & Grow", desc: "Attend your session, then leave a review to help future learners." },
];

const stats = [
  { value: "5,000+", label: "Active Students" },
  { value: "1,200+", label: "Expert Tutors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Average Rating" },
];

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/tutors`, { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data && Array.isArray(result.data)) {
          setFeaturedTutors(result.data.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [baseUrl]);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-yellow-300 blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Sparkles size={14} />
              <span className="text-sm font-semibold">SkillBridge — Learn from Experts</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-white via-indigo-100 to-pink-100 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Connect. Learn.
              <br className="hidden md:block" />
              Grow Together.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-100 md:text-xl">
              SkillBridge connects passionate learners with expert tutors. Browse profiles, check
              availability, and book sessions instantly.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/tutors"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-indigo-700 transition hover:scale-105 hover:shadow-xl">
                Browse Tutors <ArrowRight size={16} />
              </Link>
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white transition hover:bg-white/10">
                Become a Tutor
              </Link>
            </div>
            <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-indigo-200">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Zap size={12} /> How it works
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Start learning in 3 easy steps
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <step.icon size={22} />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">Step {i + 1}</div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED TUTORS ─── */}
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                <ShieldCheck size={12} /> Verified Experts
              </div>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Featured tutors</h2>
              <p className="mt-2 text-slate-500">Top-rated tutors ready to help you succeed.</p>
            </div>
            <Link href="/tutors"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition">
              View all tutors <ChevronRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-3xl bg-white border border-slate-100" />
              ))}
            </div>
          ) : featuredTutors.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-indigo-200 bg-white p-16 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-slate-700">No tutors yet</h3>
              <p className="mt-2 text-sm text-slate-400">Tutors will appear here once they create profiles.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTutors.map((tutor) => (
                <div key={tutor.id} className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm">
                      <TutorAvatar tutor={tutor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900">{tutor.user.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin size={11} /><span className="truncate">{tutor.location || "—"}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={tutor.avgRating} />
                        <span className="text-xs text-slate-400">{tutor.avgRating.toFixed(1)} ({tutor.totalReviews})</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-indigo-600">${tutor.hourlyRate}</div>
                      <div className="text-xs text-slate-400">/hour</div>
                    </div>
                  </div>

                  {tutor.categories && tutor.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tutor.categories.slice(0, 3).map(({ category }) => (
                        <span key={category.id} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">{tutor.bio}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={`/tutors/${tutor.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-indigo-200 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition">
                      <BookOpen size={14} /> Profile
                    </Link>
                    <Link href={`/tutors/${tutor.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-sm font-semibold text-white hover:shadow-md hover:shadow-indigo-200 transition">
                      <CalendarDays size={14} /> Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY SKILLBRIDGE ─── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                <MessageSquareQuote size={12} /> Why SkillBridge
              </div>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                The smarter way to learn
              </h2>
              <p className="mt-4 text-slate-500">
                We believe every learner deserves personalized guidance. SkillBridge makes it easy to
                find the right tutor, set a schedule, and track your progress.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Browse hundreds of verified tutors across dozens of subjects",
                  "Flexible scheduling — book sessions at times that work for you",
                  "Transparent reviews so you can choose with confidence",
                  "Direct booking — no middleman, no hidden fees",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 transition hover:shadow-lg hover:shadow-indigo-200">
                  Get started free <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, title: "For Students", desc: "Book 1-on-1 sessions with experts, track learning progress, leave reviews.", color: "bg-indigo-50 text-indigo-600" },
                { icon: ShieldCheck, title: "Verified Tutors", desc: "Every tutor goes through a profile review before going public.", color: "bg-emerald-50 text-emerald-600" },
                { icon: Star, title: "Star Ratings", desc: "Real reviews from real students to help you choose the best match.", color: "bg-amber-50 text-amber-600" },
                { icon: CalendarDays, title: "Easy Scheduling", desc: "Tutors set weekly availability, students pick their slot.", color: "bg-sky-50 text-sky-600" },
              ].map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-100 p-6 hover:border-indigo-100 hover:shadow-sm transition">
                  <div className={`mb-4 inline-flex rounded-2xl p-3 ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-500">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="text-3xl font-bold md:text-4xl">Ready to start your learning journey?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Join thousands of students already mastering new skills with SkillBridge tutors.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-indigo-700 hover:scale-105 transition hover:shadow-xl">
              Create Free Account
            </Link>
            <Link href="/tutors"
              className="rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white hover:bg-white/10 transition">
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
