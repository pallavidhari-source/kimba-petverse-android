import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BecomeHost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [kycDocument, setKycDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get("fullName") as string;
      const phone = formData.get("phone") as string;
      const address = formData.get("address") as string;

      if (!kycDocument || !selfie) {
        toast.error("Please upload all required documents");
        return;
      }

      // Upload files
      const kycUrl = await uploadFile(
        kycDocument,
        "kyc-documents",
        `${user.id}/kyc-${Date.now()}.${kycDocument.name.split('.').pop()}`
      );

      const selfieUrl = await uploadFile(
        selfie,
        "kyc-documents",
        `${user.id}/selfie-${Date.now()}.${selfie.name.split('.').pop()}`
      );

      // Submit application
      const { error } = await supabase.from("host_applications").insert({
        user_id: user.id,
        full_name: fullName,
        phone,
        kyc_document_url: kycUrl,
        selfie_url: selfieUrl,
        status: "pending",
      });

      if (error) throw error;
      toast.success("Application submitted successfully! We'll review it soon and notify you when approved.");
      
      navigate("/host-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">Become a Host</CardTitle>
            <CardDescription>
              Submit your KYC details to get verified as a pet host
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="Your complete residential address"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Documents</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="kycDocument">KYC Document (Aadhar/PAN/DL) *</Label>
                  <Input
                    id="kycDocument"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setKycDocument(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload your Aadhar card, PAN card, or Driver's License
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selfie">Selfie with ID Document *</Label>
                  <Input
                    id="selfie"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Take a clear selfie holding your ID document
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong> After admin approval, you'll be able to set your availability schedule and register your pet experiences from your host dashboard.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BecomeHost;
