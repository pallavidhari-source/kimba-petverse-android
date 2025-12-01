import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface HostApplication {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  kyc_document_url: string;
  selfie_url: string;
  admin_notes: string | null;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  total_price: number;
  created_at: string;
  user_id: string;
  pet_id: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedApp, setSelectedApp] = useState<HostApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const isReset = searchParams.get('reset') === 'true';
    if (isReset) {
      setShowPasswordReset(true);
    } else {
      checkAuth();
    }
  }, [searchParams]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsAuthenticated(false);
      return;
    }

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (roles) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      loadData();
    } else {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  };

  const loadData = async () => {
    // Load host applications
    const { data: apps } = await supabase
      .from("host_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (apps) setHostApplications(apps);

    // Load bookings (experience requests)
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsData) setBookings(bookingsData);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      await checkAuth();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = async (filePath: string) => {
    try {
      // Generate signed URL with 1 hour expiration
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .createSignedUrl(filePath, 3600);
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      toast.error("Failed to load document");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const updateApplicationStatus = async (appId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("host_applications")
        .update({ 
          status,
          admin_notes: adminNotes || null
        })
        .eq("id", appId);

      if (error) throw error;

      // If approved, add host role to user
      if (status === "approved") {
        const app = hostApplications.find(a => a.id === appId);
        if (app) {
          const { data: existingRole } = await supabase
            .from("user_roles")
            .select("id")
            .eq("user_id", app.user_id)
            .eq("role", "host")
            .single();
          
          if (!existingRole) {
            await supabase.from("user_roles").insert({
              user_id: app.user_id,
              role: "host"
            });
          }
        }
      }

      toast.success(`Application ${status}`);
      loadData();
      setSelectedApp(null);
      setAdminNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update application");
    }
  };

  const handleAdminForgotPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }

    if (resetEmail.toLowerCase().trim() !== 'pallavidhari@gmail.com') {
      toast.error("Only admin accounts can reset password here");
      return;
    }

    setLoading(true);
    try {
      // Generate password reset link using Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin?reset=true`
      });

      if (resetError) throw resetError;

      // Send custom email via edge function
      const resetLink = `${window.location.origin}/admin?reset=true`;
      const { error: emailError } = await supabase.functions.invoke('send-password-reset', {
        body: { 
          email: resetEmail,
          resetLink 
        }
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        toast.error("Failed to send email. Please check your email configuration.");
        return;
      }
      
      toast.success("Password reset email sent successfully! Check your inbox.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      setShowPasswordReset(false);
      await checkAuth();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Admin Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowPasswordReset(false);
                  navigate("/admin");
                }}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Admin Password</DialogTitle>
              <DialogDescription>
                Enter the admin email to receive a password reset link
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Admin Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="pallavidhari@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdminForgotPassword} disabled={loading} className="flex-1">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="hosts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hosts">Host Applications</TabsTrigger>
            <TabsTrigger value="bookings">Experience Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="hosts" className="space-y-4">
            {hostApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No host applications yet
                </CardContent>
              </Card>
            ) : (
              hostApplications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{app.full_name}</CardTitle>
                        <CardDescription>
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={app.status === "pending" ? "secondary" : app.status === "approved" ? "default" : "destructive"}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-sm">
                      <p><strong>Phone:</strong> {app.phone}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Documents:</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewDocument(app.kyc_document_url)}>
                          View KYC Document
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => viewDocument(app.selfie_url)}>
                          View Selfie with ID
                        </Button>
                      </div>
                    </div>

                    {app.admin_notes && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm"><strong>Admin Notes:</strong> {app.admin_notes}</p>
                      </div>
                    )}

                    {app.status === "pending" && (
                      <>
                        <div className="space-y-2">
                          <Label>Admin Notes</Label>
                          <Textarea
                            placeholder="Add notes about this application..."
                            value={selectedApp?.id === app.id ? adminNotes : ""}
                            onChange={(e) => {
                              setSelectedApp(app);
                              setAdminNotes(e.target.value);
                            }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateApplicationStatus(app.id, "approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Booking #{booking.id.slice(0, 8)}</CardTitle>
                    <Badge variant={booking.status === "pending" ? "secondary" : "default"}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
