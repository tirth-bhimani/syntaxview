"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  Shield,
  Settings,
  Sun,
  Moon,
  Monitor,
  Send,
  KeyRound,
  LogOut,
  Calendar,
} from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  theme: string;
  createdAt: string;
}

type StatusMsg = { type: "success" | "error"; msg: string } | null;

// ── Sub-components ──────────────────────────────────────────

function StatusAlert({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
        type === "success"
          ? "bg-green-500/10 border border-green-500/30 text-green-400"
          : "bg-red-500/10 border border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {msg}
    </motion.div>
  );
}

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "6+ chars", ok: password.length >= 6 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-blue-500", "bg-green-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const textColors = ["text-red-400", "text-orange-400", "text-blue-400", "text-green-400"];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-white/40">Strength</span>
        <span className={textColors[score - 1] || "text-white/30"}>{labels[score - 1] || "—"}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? "text-green-400/80" : "text-white/30"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${c.ok ? "bg-green-400" : "bg-white/20"}`} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── OTP Steps ──────────────────────────────────────

type OtpStep = "idle" | "sending" | "sent" | "verifying" | "done";

function PasswordSection({ userEmail }: { userEmail: string }) {
  const [step, setStep] = useState<OtpStep>("idle");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<StatusMsg>(null);

  // countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOtp = async () => {
    setStep("sending");
    setStatus(null);
    try {
      const res = await fetch("/api/settings/send-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error });
        setStep("idle");
      } else {
        setStatus({ type: "success", msg: `Code sent to ${data.email}` });
        setStep("sent");
        setCountdown(60);
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again." });
      setStep("idle");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!code || code.length !== 6) {
      setStatus({ type: "error", msg: "Enter the 6-digit code from your email." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", msg: "Password must be at least 6 characters." });
      return;
    }
    setStep("verifying");
    try {
      const res = await fetch("/api/settings/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error });
        setStep("sent");
      } else {
        setStatus({ type: "success", msg: "Password changed successfully! 🎉" });
        setStep("done");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again." });
      setStep("sent");
    }
  };

  return (
    <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20 dark:bg-black/50 light:bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="w-5 h-5 text-cyan-400" />
          Change Password
        </CardTitle>
        <CardDescription>
          A 6-digit code will be emailed to{" "}
          <span className="text-cyan-400 font-medium">{userEmail}</span> to confirm your
          identity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1 — Send OTP */}
        {step === "idle" || step === "sending" ? (
          <Button
            onClick={handleSendOtp}
            disabled={step === "sending"}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
          >
            {step === "sending" ? (
              <Spinner />
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Verification Code
              </span>
            )}
          </Button>
        ) : step === "done" ? (
          <div>
            {status && <StatusAlert type={status.type} msg={status.msg} />}
            <Button
              onClick={() => { setStep("idle"); setStatus(null); }}
              variant="outline"
              className="w-full mt-3 rounded-xl bg-transparent border-cyan-500/20 text-white"
            >
              Change Again
            </Button>
          </div>
        ) : (
          /* Step 2 — Enter code + new password */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <p className="text-xs text-white/50 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Code sent! Check your inbox.
              </p>

              {/* OTP code input */}
              <div className="space-y-2 mb-4">
                <label className="text-sm text-white/70 font-medium">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    placeholder="123456"
                    className="pl-10 bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-white placeholder:text-white/20 h-11 rounded-xl font-mono text-lg tracking-widest text-center"
                  />
                </div>
              </div>

              {/* New password */}
              <div className="space-y-2 mb-3">
                <label className="text-sm text-white/70 font-medium">New Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-white placeholder:text-white/20 h-11 rounded-xl"
                  />
                </div>
                {newPassword.length > 0 && <PasswordStrength password={newPassword} />}
              </div>

              {/* Confirm new password */}
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Confirm New Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-white placeholder:text-white/20 h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* Resend with countdown */}
              <div className="mt-3 text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-white/30">Resend in {countdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>

            {status && <StatusAlert type={status.type} msg={status.msg} />}

            <Button
              type="submit"
              disabled={step === "verifying"}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
            >
              {step === "verifying" ? <Spinner /> : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Update Password
                </span>
              )}
            </Button>
          </form>
        )}

        {step !== "done" && step !== "idle" && step !== "sending" ? null : (
          status && <StatusAlert type={status.type} msg={status.msg} />
        )}
      </CardContent>
    </Card>
  );
}

// ── Appearance Section ──────────────────────────────────────

function AppearanceSection({ savedTheme }: { savedTheme: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleThemeChange = async (t: string) => {
    setTheme(t);
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: t }),
    }).catch(console.error);
    setSaving(false);
  };

  if (!mounted) return null;

  return (
    <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {theme === "light" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-cyan-400" />
          )}
          Appearance
          {saving && <span className="text-xs text-white/40 ml-auto">Saving…</span>}
        </CardTitle>
        <CardDescription>Choose how SyntaxView looks to you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Settings Page ──────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileStatus, setProfileStatus] = useState<StatusMsg>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: UserProfile) => {
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch(console.error);
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    setProfileLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) setProfileStatus({ type: "error", msg: data.error });
      else {
        setProfileStatus({ type: "success", msg: "Profile updated!" });
        setProfile((p) => p ? { ...p, name, email } : p);
      }
    } catch {
      setProfileStatus({ type: "error", msg: "Something went wrong." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true);
    await fetch("/api/settings", { method: "DELETE" }).catch(console.error);
    await signOut({ callbackUrl: "/" });
  };

  const avatarLetter =
    profile?.name?.charAt(0)?.toUpperCase() ||
    session?.user?.name?.charAt(0)?.toUpperCase() ||
    "U";

  const cardBase = "bg-black/50 backdrop-blur-lg border border-cyan-500/20 dark:bg-black/50";

  return (
    <div className="max-w-2xl mx-auto text-white py-4 pb-16 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-7 h-7 text-cyan-400" />
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>
        <p className="text-white/50 text-sm">Manage your profile, security, and appearance.</p>
      </motion.div>

      {/* ── Profile Card (read-only info) ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className={cardBase}>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg shadow-cyan-500/20">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">
                {profile?.name || session?.user?.name || "—"}
              </h2>
              <p className="text-white/60 text-sm mt-0.5 truncate">
                {profile?.email || session?.user?.email || "—"}
              </p>
              {profile?.createdAt && (
                <p className="text-white/30 text-xs mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2.5 rounded-xl text-white/30 hover:text-white hover:bg-red-500/20 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Account Information (editable) ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card className={cardBase}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-cyan-400" />
              Account Information
            </CardTitle>
            <CardDescription>Update your display name and email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-white placeholder:text-white/30 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-white placeholder:text-white/30 h-11 rounded-xl"
                  />
                </div>
              </div>
              {profileStatus && <StatusAlert type={profileStatus.type} msg={profileStatus.msg} />}
              <Button
                type="submit"
                disabled={profileLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
              >
                {profileLoading ? <Spinner /> : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Password 2-Step ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
        <PasswordSection userEmail={profile?.email || session?.user?.email || ""} />
      </motion.div>

      {/* ── Appearance ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <AppearanceSection savedTheme={profile?.theme || "dark"} />
      </motion.div>

      {/* ── Danger Zone ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
        <Card className="bg-black/50 backdrop-blur-lg border border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-400">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all its data. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
              <p className="text-sm text-white/60">
                Type{" "}
                <span className="text-red-400 font-mono font-bold">DELETE</span>{" "}
                to confirm:
              </p>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="bg-white/5 border-red-500/20 focus:border-red-500 text-white placeholder:text-white/20 h-11 rounded-xl font-mono"
              />
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleteLoading}
                variant="destructive"
                className="w-full h-11 rounded-xl"
              >
                {deleteLoading ? <Spinner /> : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete My Account
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
