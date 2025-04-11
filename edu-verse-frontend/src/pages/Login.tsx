
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    console.log("Email:", email, "Password:", password);
    login(email, password);

    // For demo purposes, show login credentials for each role
    // toast({
    //   title: "Demo Logins",
    //   description: (
    //     <div className="text-sm">
    //       <p>Student: student@example.com / password</p>
    //       <p>Instructor: instructor@example.com / password</p>
    //       <p>Admin: admin@example.com / password</p>
    //     </div>
    //   ),
    // });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lms-background">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-lms-blue">EduVerse LMS</h1>
          <p className="text-gray-500">Your Gateway to Knowledge</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lms-blue focus:ring-lms-blue"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <a href="#" className="text-xs text-lms-blue hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lms-blue focus:ring-lms-blue"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-lms-blue text-white font-semibold py-2 rounded-md hover:bg-lms-blue/80 focus:outline-none focus:ring-2 focus:ring-lms-blue focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <a href="#" className="text-lms-blue font-medium hover:underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
