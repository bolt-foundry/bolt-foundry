import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function VerificationSuccess() {
  const [_, navigate] = useLocation();

  // Auto-redirect to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth?verified=true");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            You can now enjoy full access to the Contact Management System. You
            will be redirected to the login page in a few seconds.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate("/auth?verified=true")}
            className="w-full max-w-xs"
          >
            Continue to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
