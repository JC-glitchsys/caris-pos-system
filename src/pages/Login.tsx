import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/pos");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#F28322] via-[#F8B15F] to-[#F2EDD5]">

      <Card className="w-full max-w-lg rounded-[2rem] border-0 bg-white shadow-2xl overflow-hidden">

        <CardHeader className="text-center pt-12 pb-7 px-8">
          <CardTitle className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#D9501E]">
            POS System
          </CardTitle>

          <p className="text-xl sm:text-2xl font-medium text-[#F28322] mt-2">
            Point of Sale
          </p>

          <p className="text-sm text-gray-500 mt-5">
            Sign in to continue to your cashier account
          </p>
        </CardHeader>

        <CardContent className="px-8 sm:px-12 pb-12">
          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="h-12 rounded-xl border-gray-200 px-4 focus-visible:ring-[#F28322]"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="h-12 rounded-xl border-gray-200 px-4 focus-visible:ring-[#F28322]"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-[#D9501E] hover:bg-[#F28322] transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;