import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Radiologist");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";

      const payload = isSignUp
        ? {
            full_name: name,
            email,
            password,
            role,
          }
        : {
            email,
            password,
          };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // ✅ LOGIN SUCCESS
      if (!isSignUp) {
        localStorage.setItem("token", data.access_token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.success("Account created successfully. Please log in.");
        setIsSignUp(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MedVision AI</h1>
          <p className="text-muted-foreground">
            Advanced Radiology Analysis Platform
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? "Enter details to create your account"
                : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      className="w-full rounded-md border p-2 bg-background"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option>Radiologist</option>
                      <option>Physician</option>
                      <option>Medical Researcher</option>
                      <option>Hospital Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isSignUp && (
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don’t have an account? Sign up"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
