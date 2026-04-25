"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  LoaderCircle,
  ShieldCheck,
  UserCircle,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type TutorBooking = {
  id: number;
  scheduledAt: string;
  status: BookingStatus;
  student: {
    name: string;
  };
};

type TutorProfileSummary = {
  id: number;
  availability: { id?: number }[];
};

const TutorDashboard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [profile, setProfile] = useState<TutorProfileSummary | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setIsLoadingData(false);
        return;
      }

      try {
        const [profileResponse, bookingsResponse] = await Promise.all([
          fetch(`${baseUrl}/tutors/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/booking`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        const profileResult = await profileResponse.json();
        const bookingsResult = await bookingsResponse.json();

        if (profileResponse.ok && profileResult.data) {
          setProfile(profileResult.data as TutorProfileSummary);
        }

        if (bookingsResponse.ok && Array.isArray(bookingsResult.data)) {
          setBookings(bookingsResult.data as TutorBooking[]);
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [baseUrl, token]);

  const confirmedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "CONFIRMED").length,
    [bookings],
  );

  const completedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED").length,
    [bookings],
  );

  const nextSession = useMemo(
    () =>
      bookings.find((booking) => booking.status === "CONFIRMED") ?? null,
    [bookings],
  );

  if (isLoading || isLoadingData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.name ? `Welcome back, ${user.name}` : "Tutor dashboard"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
              Follow the tutor journey from profile setup to availability,
              incoming sessions, and completed lessons.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {profile?.availability?.length ?? 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">Published weekly slots</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-900">Confirmed</h2>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{confirmedCount}</p>
          <p className="mt-1 text-sm text-slate-500">Sessions waiting for delivery</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Completed</h2>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{completedCount}</p>
          <p className="mt-1 text-sm text-slate-500">Lessons successfully delivered</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Name:</span> {user?.name || "Unavailable"}</p>
            <p><span className="font-medium text-slate-900">Email:</span> {user?.email || "Unavailable"}</p>
            <p><span className="font-medium text-slate-900">Role:</span> {user?.role || "Unavailable"}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="rounded-2xl bg-sky-600 text-white hover:bg-sky-700">
              <Link href="/tutor/profile">Manage profile</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/tutor/availability">Set availability</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Next step</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            {isAuthenticated
              ? nextSession
                ? `Your next confirmed session is with ${nextSession.student.name} on ${new Date(nextSession.scheduledAt).toLocaleString()}.`
                : "You are ready to receive bookings. Keep your profile and availability up to date."
              : "No active session found. Please sign in again to continue."}
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-2xl">
            <Link href="/tutor/sessions">Open sessions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TutorDashboard;
