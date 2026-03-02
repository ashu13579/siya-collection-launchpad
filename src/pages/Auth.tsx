import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back! 🎉");
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to verify your account! 📧");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-hover p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🧸</span>
            <h1 className="text-2xl font-extrabold text-foreground mt-2">
              {mode === "login" ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to your Siya Collection account" : "Join Siya Collection today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl gradient-hero text-primary-foreground font-bold text-sm disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-secondary font-bold hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
