"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type StudentBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  note: string | null;
  status: BookingStatus;
  tutorProfile: {
    id: number;
    bio?: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
};

type ReviewDraft = {
  bookingId: number;
  rating: number;
  comment: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const statusTone: Record<BookingStatus, string> = {
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
};

const StudentDashboardPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { token, user, isLoading: isAuthLoading } = useAuth();

  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(
    null,
  );
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<number[]>([]);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setIsLoadingBookings(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result: ApiResponse<StudentBooking[]> = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load bookings");
        }

        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load bookings";

        await Swal.fire({
          icon: "error",
          title: "Unable to load your sessions",
          text: message,
          confirmButtonColor: "#4f46e5",
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [baseUrl, token]);

  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "CONFIRMED"),
    [bookings],
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED"),
    [bookings],
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "CANCELLED"),
    [bookings],
  );

  const handleCancelBooking = async (bookingId: number) => {
    if (!token) {
      return;
    }

    setUpdatingBookingId(bookingId);

    try {
      const response = await fetch(`${baseUrl}/booking/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "CANCELLED",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Booking cancelled",
        text: "Your session has been cancelled successfully.",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel booking";

      await Swal.fire({
        icon: "error",
        title: "Cancel failed",
        text: message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!token || !reviewDraft) {
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await fetch(`${baseUrl}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: reviewDraft.bookingId,
          rating: reviewDraft.rating,
          comment: reviewDraft.comment.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review");
      }

      setReviewedBookingIds((current) => [...current, reviewDraft.bookingId]);
      setReviewDraft(null);

      await Swal.fire({
        icon: "success",
        title: "Review submitted",
        text: "Thanks for sharing your feedback.",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit review";

      await Swal.fire({
        icon: "error",
        title: "Review failed",
        text: message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isAuthLoading || isLoadingBookings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Student journey
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user?.name
                  ? `${user.name}'s Learning Dashboard`
                  : "Student dashboard"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-indigo-50/90">
                Track upcoming sessions, attend completed lessons, cancel when
                needed, and leave reviews after your learning sessions.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            {confirmedBookings.length} upcoming, {completedBookings.length}{" "}
            completed
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Upcoming sessions</p>
          <p className="mt-2 text-3xl font-bold text-sky-700">
            {confirmedBookings.length}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed lessons</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {completedBookings.length}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Cancelled bookings</p>
          <p className="mt-2 text-3xl font-bold text-rose-700">
            {cancelledBookings.length}
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">My sessions</h2>
          <p className="mt-1 text-sm text-slate-500">
            This screen maps the student flow: book, attend, cancel if needed,
            and leave a review once the tutor marks the lesson complete.
          </p>
        </div>

        <div className="space-y-4">
          {bookings.length ? (
            bookings.map((booking) => {
              const alreadyReviewed = reviewedBookingIds.includes(booking.id);

              return (
                <article
                  key={booking.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {booking.tutorProfile.user.name}
                        </h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-indigo-600" />
                          {new Date(booking.scheduledAt).toLocaleString()}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-indigo-600" />
                          {booking.duration} minutes
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-indigo-600" />$
                          {booking.totalPrice.toFixed(2)}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-indigo-600" />
                          {booking.tutorProfile.user.email}
                        </div>
                      </div>

                      {booking.note ? (
                        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                          {booking.note}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:min-w-60">
                      {booking.status === "CONFIRMED" ? (
                        <>
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                            Attend this session at the scheduled time, then wait
                            for the tutor to mark it completed.
                          </div>
                          <Button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={updatingBookingId === booking.id}
                            className="rounded-2xl bg-rose-600 text-white hover:bg-rose-700"
                          >
                            {updatingBookingId === booking.id ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                Cancel booking
                              </>
                            )}
                          </Button>
                        </>
                      ) : null}

                      {booking.status === "COMPLETED" ? (
                        <>
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            This session is complete. You can now leave a
                            review.
                          </div>
                          <Button
                            onClick={() =>
                              setReviewDraft({
                                bookingId: booking.id,
                                rating: 5,
                                comment: "",
                              })
                            }
                            disabled={alreadyReviewed}
                            className="rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <MessageSquareQuote className="h-4 w-4" />
                            {alreadyReviewed
                              ? "Review submitted"
                              : "Leave review"}
                          </Button>
                        </>
                      ) : null}

                      {booking.status === "CANCELLED" ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          This session has been cancelled.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No bookings yet. Browse tutors and book your first session to
              start the journey.
            </div>
          )}
        </div>
      </section>

      {reviewDraft ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setReviewDraft(null);
            }
          }}
        >
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-slate-900">
              Leave a review
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Share how the session went so future students can choose
              confidently.
            </p>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setReviewDraft((current) =>
                          current ? { ...current, rating: value } : current,
                        )
                      }
                      className="rounded-full p-2 transition hover:bg-amber-50"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          value <= reviewDraft.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  rows={5}
                  value={reviewDraft.comment}
                  onChange={(event) =>
                    setReviewDraft((current) =>
                      current
                        ? { ...current, comment: event.target.value }
                        : current,
                    )
                  }
                  placeholder="What did you like about the session?"
                  className="resize-none rounded-2xl"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setReviewDraft(null)}
                className="rounded-2xl"
              >
                Close
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {submittingReview ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    Submit review
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentDashboardPage;
