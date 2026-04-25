"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

type AvailabilitySlot = {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type TutorProfile = {
  id: number;
  bio: string;
  hourlyRate: number;
  experience: number;
  location: string;
  imageUrl: string | null;
  isApproved: boolean;
  avgRating: number;
  totalReviews: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  availability?: AvailabilitySlot[];
};

type TutorReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: {
    id: number;
    name: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const durationOptions = [
  { label: "30 minutes", value: "30" },
  { label: "60 minutes", value: "60" },
  { label: "90 minutes", value: "90" },
  { label: "120 minutes", value: "120" },
];

const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((value) => (
      <Star
        key={value}
        size={size}
        className={
          value <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-slate-300"
        }
      />
    ))}
  </div>
);

const TutorDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { user, token } = useAuth();

  const tutorId = Number(params.id);

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    scheduledAt: "",
    duration: "60",
    note: "",
  });

  useEffect(() => {
    const loadTutorDetails = async () => {
      if (!tutorId || Number.isNaN(tutorId)) {
        setIsLoading(false);
        return;
      }

      try {
        const [tutorResponse, reviewsResponse] = await Promise.all([
          fetch(`${baseUrl}/tutors/${tutorId}`, { cache: "no-store" }),
          fetch(`${baseUrl}/review/tutor/${tutorId}`, { cache: "no-store" }),
        ]);

        const tutorResult: ApiResponse<TutorProfile> =
          await tutorResponse.json();
        const reviewsResult: ApiResponse<TutorReview[]> =
          await reviewsResponse.json();

        if (!tutorResponse.ok) {
          throw new Error(
            tutorResult.message || "Failed to load tutor details",
          );
        }

        setTutor(tutorResult.data);
        setReviews(Array.isArray(reviewsResult.data) ? reviewsResult.data : []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load tutor details";

        await Swal.fire({
          icon: "error",
          title: "Unable to load tutor",
          text: message,
          confirmButtonColor: "#0f766e",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTutorDetails();
  }, [baseUrl, tutorId]);

  const estimatedPrice = useMemo(() => {
    if (!tutor) {
      return 0;
    }

    return (tutor.hourlyRate / 60) * Number(bookingForm.duration);
  }, [bookingForm.duration, tutor]);

  const handleBooking = async () => {
    if (!tutor) {
      return;
    }

    if (!user || !token) {
      await Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please sign in as a student to book this tutor.",
        confirmButtonColor: "#0f766e",
      });
      router.push("/login");
      return;
    }

    if (user.role !== "STUDENT") {
      await Swal.fire({
        icon: "warning",
        title: "Student account required",
        text: "Only students can create bookings.",
        confirmButtonColor: "#0f766e",
      });
      return;
    }

    if (!bookingForm.scheduledAt) {
      await Swal.fire({
        icon: "warning",
        title: "Choose a date and time",
        text: "Please select your preferred session date and time.",
        confirmButtonColor: "#0f766e",
      });
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch(`${baseUrl}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorProfileId: tutor.id,
          scheduledAt: bookingForm.scheduledAt,
          duration: Number(bookingForm.duration),
          note: bookingForm.note.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      await Swal.fire({
        icon: "success",
        title: "Booking confirmed",
        text:
          result.message ||
          `Your session with ${tutor.user.name} has been booked.`,
        confirmButtonColor: "#0f766e",
      });

      setBookingForm({
        scheduledAt: "",
        duration: "60",
        note: "",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create booking";

      await Swal.fire({
        icon: "error",
        title: "Booking failed",
        text: message,
        confirmButtonColor: "#0f766e",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#f8fafc_0%,_#f0fdfa_100%)]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-teal-600" />
          <span className="text-sm font-medium">Loading tutor details...</span>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#f8fafc_0%,_#f0fdfa_100%)] px-4">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Tutor not found
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            We could not find the tutor profile you requested.
          </p>
          <Button
            asChild
            className="mt-6 rounded-2xl bg-teal-600 text-white hover:bg-teal-700"
          >
            <Link href="/tutors">
              <ArrowLeft className="h-4 w-4" />
              Back to tutors
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.10),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#f0fdfa_100%)]">
      <section className="border-b border-teal-100/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all tutors
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {tutor.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tutor.imageUrl}
                    alt={tutor.user.name}
                    className="h-28 w-28 rounded-[28px] border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-teal-500 to-cyan-600 text-4xl font-bold text-white shadow-lg">
                    {tutor.user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {tutor.isApproved ? "Approved tutor" : "Pending approval"}
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                      {tutor.user.name}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {tutor.location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-teal-600" />
                        {tutor.user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                      <Stars rating={tutor.avgRating} />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {tutor.avgRating.toFixed(1)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tutor.totalReviews} reviews
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                      <Wallet className="h-5 w-5 text-teal-600" />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          ${tutor.hourlyRate}/hour
                        </p>
                        <p className="text-xs text-slate-500">
                          Flexible session pricing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                      <CheckCircle2 className="h-5 w-5 text-teal-600" />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {tutor.experience} years
                        </p>
                        <p className="text-xs text-slate-500">
                          Teaching experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-xl shadow-teal-100/60 backdrop-blur">
                <h2 className="text-lg font-semibold text-slate-900">
                  About this tutor
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tutor.bio}
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-teal-100/70 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Quick summary
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-teal-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Availability
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                    {tutor.availability?.length
                      ? `${tutor.availability.length} time slot${tutor.availability.length > 1 ? "s" : ""} added`
                      : "No availability slots added yet"}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Best for
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                    Students looking for one-to-one support, flexible
                    scheduling, and a clear lesson plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="space-y-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Weekly availability
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Live availability from the tutor profile route.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {tutor.availability?.length ? (
                tutor.availability.map((slot, index) => (
                  <div
                    key={`${slot.dayOfWeek}-${slot.startTime}-${index}`}
                    className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Clock3 className="h-4 w-4 text-teal-600" />
                      {dayLabels[slot.dayOfWeek]}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  This tutor has not added availability yet. You can still
                  contact them or check back later.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Student reviews
                </h2>
            
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Average
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {tutor.avgRating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.student.name}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <Stars rating={review.rating} size={14} />
                          <span className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <MessageSquareQuote className="h-5 w-5 text-teal-500" />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {review.comment ||
                        "This student left a rating without a written comment."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No reviews yet. Once students complete sessions and leave
                  feedback, reviews will appear here.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">
              Book a session
            </h2>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Session date and time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={bookingForm.scheduledAt}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      scheduledAt: event.target.value,
                    }))
                  }
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={bookingForm.duration}
                  onValueChange={(value) =>
                    setBookingForm((current) => ({
                      ...current,
                      duration: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-2xl">
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note for the tutor</Label>
                <Textarea
                  id="note"
                  rows={5}
                  value={bookingForm.note}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                  placeholder="Mention the topic, your goals, or anything the tutor should prepare."
                  className="resize-none rounded-2xl"
                />
              </div>

              <div className="rounded-3xl bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-100">
                  Estimated total
                </p>
                <p className="mt-2 text-3xl font-bold">
                  ${estimatedPrice.toFixed(2)}
                </p>
                <p className="mt-2 text-sm text-teal-50/90">
                  Based on ${tutor.hourlyRate}/hour for {bookingForm.duration}{" "}
                  minutes.
                </p>
              </div>

              <Button
                onClick={handleBooking}
                disabled={isBooking}
                className="h-12 w-full rounded-2xl bg-teal-600 text-white hover:bg-teal-700"
              >
                {isBooking ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-4 w-4" />
                    Book this tutor
                  </>
                )}
              </Button>

              <p className="text-xs leading-6 text-slate-500">
                Booking is available for signed-in students. Tutors and admins
                can view this page, but cannot create bookings.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default TutorDetailsPage;
