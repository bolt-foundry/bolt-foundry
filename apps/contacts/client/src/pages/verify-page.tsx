import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle, Loader2, MailCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  const [location, navigate] = useLocation();
  const { user, resendVerificationMutation } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<
    "checking" | "success" | "error" | null
  >(null);

  // Get token from URL if present
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const token = searchParams.get("token");
  const verified = searchParams.get("verified");

  // Handle token verification or verification success flag
  useEffect(() => {
    // If we have the verified flag in the URL (from redirect after successful verification)
    if (verified === "true") {
      setVerificationStatus("success");
      // Reload user data after successful verification
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      return;
    }

    // If we have a token, we need to verify it
    if (token) {
      setVerificationStatus("checking");

      // We'll use the server's API endpoint directly
      // The server will handle the redirect after verification
      window.location.href = `/api/verify?token=${token}`;
    }
  }, [token, verified]);

  // If no user, redirect to login
  if (!user) {
    navigate("/auth");
    return null;
  }

  // If user is already verified, redirect to home
  if (user.isVerified) {
    navigate("/");
    return null;
  }

  // Handle resend verification
  const handleResendVerification = () => {
    resendVerificationMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {token
              ? (
                verificationStatus === "checking"
                  ? (
                    "Verifying your email..."
                  )
                  : verificationStatus === "success"
                  ? (
                    "Email Verified!"
                  )
                  : (
                    "Verification Failed"
                  )
              )
              : (
                "Email Verification Required"
              )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {token
            ? (
              verificationStatus === "checking"
                ? (
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p>Please wait while we verify your email address...</p>
                  </div>
                )
                : verificationStatus === "success"
                ? (
                  <div className="flex flex-col items-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <p>Your email has been successfully verified!</p>
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to the home page shortly...
                    </p>
                  </div>
                )
                : (
                  <div className="flex flex-col items-center space-y-4">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                    <p>
                      We couldn't verify your email. The verification link may
                      be expired or invalid.
                    </p>
                  </div>
                )
            )
            : (
              <div className="flex flex-col items-center space-y-4">
                <MailCheck className="h-16 w-16 text-primary" />
                <p>
                  Hi{" "}
                  <span className="font-semibold">{user.name}</span>, we've sent
                  a verification link to{" "}
                  <span className="font-semibold">{user.email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the verification link to
                  activate your account.
                </p>
              </div>
            )}
        </CardContent>

        {(!token || verificationStatus === "error") && (
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                )
                : (
                  "Resend Verification Email"
                )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
