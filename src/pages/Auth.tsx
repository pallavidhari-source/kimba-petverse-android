import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isHostSignup, setIsHostSignup] = useState(false);

  // Allowed emails for development
  const allowedEmails = [
    'pallavidhari@gmail.com',
    'shivahosur@gmail.com',
    'anvikahosur@gmail.com',
    'pallavihosur09@gmail.com',
    'hosurpallavi@gmail.com'
  ];

  const isEmailAllowed = (email: string) => {
    return allowedEmails.includes(email.toLowerCase().trim());
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    // Check if email is allowed
    if (!isEmailAllowed(email)) {
      toast.error("This email is not authorized to access this application during development.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) throw error;

      // If signing up as host, add host role
      if (isHostSignup && data.user) {
        await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: "host"
        });
      }

      toast.success("Account created successfully!");
      
      // Redirect hosts to registration page, others to explore
      if (isHostSignup) {
        navigate("/become-host");
      } else {
        navigate("/explore");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check if email is allowed
    if (!isEmailAllowed(email)) {
      toast.error("This email is not authorized to access this application during development.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is a host
      if (data.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "host");

        // If host, check if they have completed application
        if (roles && roles.length > 0) {
          const { data: application } = await supabase
            .from("host_applications")
            .select("id, status")
            .eq("user_id", data.user.id)
            .maybeSingle();

          // Redirect to registration if no application exists
          if (!application) {
            toast.success("Welcome! Please complete your host registration.");
            navigate("/become-host");
            return;
          }

          // Redirect host to host dashboard
          toast.success("Welcome back, Host!");
          navigate("/host-dashboard");
          return;
        }
      }

      toast.success("Welcome back!");
      navigate("/explore");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Kimba Petverse</CardTitle>
            <CardDescription>Sign in or create an account to start booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <input
                      type="checkbox"
                      id="host-signup"
                      checked={isHostSignup}
                      onChange={(e) => setIsHostSignup(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="host-signup" className="text-sm font-medium leading-none">
                      I want to become a pet host
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;