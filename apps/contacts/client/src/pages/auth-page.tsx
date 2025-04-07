import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form schemas
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .refine((email) => email.endsWith("@boltfoundry.com"), {
      message: "Only boltfoundry.com email addresses are allowed",
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email")
    .refine((email) => email.endsWith("@boltfoundry.com"), {
      message: "Only boltfoundry.com email addresses are allowed",
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const { user, loginMutation, registerMutation } = useAuth();

  // Check for verified flag in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split("?")[1] || "");
    const verified = searchParams.get("verified");

    if (verified === "true") {
      setIsVerified(true);
      // Set the tab to login
      setActiveTab("login");
    }
  }, [location]);

  // Redirect if already logged in - moved inside useEffect to avoid React warning
  useEffect(() => {
    console.log("Auth page - User state changed:", user);
    if (user) {
      console.log("User is authenticated, redirecting to home");
      navigate("/");
    }
  }, [user, navigate]);

  // Show loading indicator while checking authentication status
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, don't render this page
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Form section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
        {isVerified && (
          <Alert className="mb-4 bg-green-50 border-green-200 w-full max-w-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your email has been successfully verified! You can now log in to
              your account.
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-center items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Bolt Foundry CMS
          </h1>
          <p className="text-lg mb-6">
            A modern platform designed to streamline your contact management
            workflow. Track, organize, and engage with your contacts
            efficiently.
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/20 mr-2">
                ✓
              </div>
              <span>Efficient contact organization</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/20 mr-2">
                ✓
              </div>
              <span>Simple tracking of outreach efforts</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/20 mr-2">
                ✓
              </div>
              <span>API-driven architecture for flexibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@boltfoundry.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              )
              : (
                "Login"
              )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="your.name@boltfoundry.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="********"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="********"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              )
              : (
                "Register"
              )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
