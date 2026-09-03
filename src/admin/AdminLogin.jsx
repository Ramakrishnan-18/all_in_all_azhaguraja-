import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Film, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

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
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-10">
          <span className="w-9 h-9 border border-signal-gold flex items-center justify-center">
            <Film size={16} className="text-signal-gold" />
          </span>
          <span className="font-display text-xl text-paper">Studio Admin</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-studio-blue-deep p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <label className="eyebrow text-paper/50 mb-1 block">Email</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter your email"
              className="w-full bg-transparent border-b border-paper/20 py-3.5 text-paper text-base outline-none focus:border-signal-gold placeholder:text-paper/30"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          <div>
            <label className="eyebrow text-paper/50 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                inputMode="text"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-transparent border-b border-paper/20 py-3.5 pr-12 text-paper text-base outline-none focus:border-signal-gold placeholder:text-paper/30"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-paper/40 hover:text-signal-gold transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400"><AlertCircle size={15} /> {error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="eyebrow bg-signal-gold text-ink py-4 mt-2 hover:bg-paper transition-colors disabled:opacity-60 text-sm font-bold tracking-wider cursor-pointer"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
