import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ NEW STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ LOGIN FUNCTION
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      console.log("Logged in:", res.data);

      // 👉 optional redirect
      window.location.href = "/dashboard";

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-primary-foreground/80 text-lg">
            Continue your learning journey. Your summaries, quizzes, and study plans are waiting.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">EL-Zatona</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
            Log in
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to continue
          </p>

          {/* ✅ UPDATED FORM */}
          <form className="space-y-4" onSubmit={handleLogin}>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Log in
            </Button>
          </form>
          <p className="text-sm text-right">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </p>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;