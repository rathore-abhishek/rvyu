"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { signIn, signInSocial } from "@/actions/auth";
import { SignInSchema } from "@/types/auth";
import { useForm } from "@tanstack/react-form";
import { signInSchema } from "@/validation/auth";
import Tick from "@/components/icons/tick";
import { Lock, Mail } from "@/components/icons";
import Github from "@/components/icons/github";
import Google from "@/components/icons/google";
import EyeOpen from "@/components/icons/eye-open";
import EyeClose from "@/components/icons/eye-close";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignInSchema,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async () => {
      await signInMutation(form.state.values);
    },
  });

  const {
    mutateAsync: signInMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: signIn,
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const handleSocialLogin = async (provider: "google" | "github") => {
    await signInSocial(provider);
  };

  return (
    <div className="bg-background my-32 flex items-center justify-center px-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-muted-foreground font-serif text-4xl">
            Welcome back!
          </h1>
          <p className="text-foreground font-serif text-5xl">
            Login to your account.
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4">
            {error && (
              <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            )}

            {isSuccess && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Tick className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Login Email Sent!
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      We&apos;ve sent a login verification email to{" "}
                      <span className="font-semibold">
                        {form.state.values.email}
                      </span>
                      . Please check your inbox and click the link to complete
                      sign in.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>
                          <Mail />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isPending}
                        aria-invalid={field.state.meta.errors.length > 0}
                      />
                    </InputGroup>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>
                          <Lock />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={(field.state.value as string) || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isPending}
                        aria-invalid={field.state.meta.errors.length > 0}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <EyeClose /> : <EyeOpen />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
              >
                <Google />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("github")}
              >
                <Github />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
