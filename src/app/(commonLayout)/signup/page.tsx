"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  User,
  GraduationCap,
  Mail,
  Lock,
  UserCircle,
  BookOpen,
  Layers,
  Zap,
} from "lucide-react";
import { useFormAnimation } from "@/hooks/UseGsapRegister";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
}

// ── Left panel floating feature cards ──────────────────────────────────────
const features = [
  {
    icon: <User size={16} className="text-purple-400" />,
    bg: "bg-purple-500/20",
    title: "500+ Expert Tutors",
    sub: "Verified professionals",
  },
  {
    icon: <BookOpen size={16} className="text-teal-400" />,
    bg: "bg-teal-500/20",
    title: "1,200+ Courses",
    sub: "All skill levels",
  },
  {
    icon: <Zap size={16} className="text-pink-400" />,
    bg: "bg-pink-500/20",
    title: "Live Sessions",
    sub: "Real-time feedback",
  },
];

// ── Floating card component ─────────────────────────────────────────────────
const FloatCard = ({
  feature,
  delay,
}: {
  feature: (typeof features)[0];
  delay: string;
}) => (
  <div
    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
    style={{ animation: `floatup 3s ease-in-out ${delay} infinite` }}
  >
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${feature.bg}`}
    >
      {feature.icon}
    </div>
    <div>
      <p className="text-sm font-medium text-stone-100">{feature.title}</p>
      <p className="text-xs text-stone-500">{feature.sub}</p>
    </div>
  </div>
);

// ── Main SignUp component ───────────────────────────────────────────────────
const SignUp = () => {
  const containerRef = useFormAnimation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: { role: "STUDENT", name: "", email: "", password: "" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Registration successful!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>

      <div
        ref={containerRef}
        className="font-body flex min-h-screen items-center justify-center bg-slate-100 p-4"
      >
        <div className="grid w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">

          {/* ── LEFT PANEL ── */}
          <div className="relative hidden overflow-hidden bg-[#0f1623] md:flex md:flex-col md:items-center md:justify-center md:gap-8 md:px-10 md:py-14">

            {/* Grid overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Gradient orbs */}
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute -left-14 -top-14 h-56 w-56 rounded-full"
                style={{
                  background: "radial-gradient(circle,#5a4de6,transparent 70%)",
                  animation: "orb-pulse 6s ease-in-out 0s infinite",
                  opacity: 0.25,
                }}
              />
              <div
                className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full"
                style={{
                  background: "radial-gradient(circle,#2dd4bf,transparent 70%)",
                  animation: "orb-pulse 6s ease-in-out 2s infinite",
                  opacity: 0.25,
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "radial-gradient(circle,#e879f9,transparent 70%)",
                  animation: "orb-pulse 6s ease-in-out 4s infinite",
                  opacity: 0.25,
                }}
              />
            </div>

            {/* Headline */}
            <div className="relative z-10 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-400">
                Welcome aboard
              </p>
              <h1 className="font-display text-3xl font-bold leading-snug text-stone-100">
                Start your<br />learning journey
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">
                Connect with expert tutors and<br />unlock your full potential today.
              </p>
            </div>

            {/* Feature cards */}
            <div className="relative z-10 flex w-full max-w-xs flex-col gap-3">
              {features.map((f, i) => (
                <FloatCard
                  key={f.title}
                  feature={f}
                  delay={`${i}s`}
                />
              ))}
            </div>

            {/* Dots */}
            <div className="relative z-10 flex items-center gap-2">
              <div className="h-1.5 w-5 rounded-full bg-indigo-500" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex flex-col justify-center bg-white px-8 py-12">
            <div className="mb-7">
              <h2 className="font-display text-2xl font-bold text-slate-800">
                Create Account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Join our community today — it&apos;s free.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3">
                {(["STUDENT", "TUTOR"] as const).map((r) => {
                  const active = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setValue("role", r)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-all ${
                        active
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {r === "STUDENT" ? (
                        <GraduationCap size={22} />
                      ) : (
                        <User size={22} />
                      )}
                      {r}
                    </button>
                  );
                })}
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name is too short" },
                    })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    type="password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Min. 8 characters"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-medium tracking-wide text-white shadow-lg shadow-indigo-200 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? "Creating Account…" : "Register"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <a href="#" className="font-medium text-indigo-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUp;