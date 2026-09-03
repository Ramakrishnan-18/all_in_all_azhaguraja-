import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Film, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { email: "admin@studio.com", password: "studio2026" } });

  const onSubmit = async (data) => {
    setError("");
    try {
      await login(data.email, data.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-10">
          <span className="w-9 h-9 border border-signal-gold flex items-center justify-center">
            <Film size={16} className="text-signal-gold" />
          </span>
          <span className="font-display text-xl text-paper">Studio Admin</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-studio-blue-deep p-8 flex flex-col gap-5">
          <div>
            <label className="eyebrow text-paper/50">Email</label>
            <input
              className="w-full bg-transparent border-b border-paper/20 py-3 text-paper outline-none focus:border-signal-gold"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <label className="eyebrow text-paper/50">Password</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-paper/20 py-3 text-paper outline-none focus:border-signal-gold"
              {...register("password", { required: true })}
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400"><AlertCircle size={15} /> {error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="eyebrow bg-signal-gold text-ink py-4 mt-2 hover:bg-paper transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
          <p className="font-mono text-[11px] text-paper/40 text-center">
            Demo credentials are pre-filled — replace with real auth once the API is live.
          </p>
        </form>
      </div>
    </div>
  );
}
