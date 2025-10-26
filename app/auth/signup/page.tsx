"use client";

import { useState } from "react";
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
import { signUp, signInSocial } from "@/actions/auth";
import { Lock, Mail, User } from "@/components/icons";
import Tick from "@/components/icons/tick";
import Github from "@/components/icons/github";
import Google from "@/components/icons/google";
import EyeOpen from "@/components/icons/eye-open";
import EyeClose from "@/components/icons/eye-close";
import { useForm } from "@tanstack/react-form";
import { signUpWithConfirmSchema } from "@/validation/auth";
import { SignUpWithConfirmSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignUpWithConfirmSchema,
    validators: {
      onSubmit: signUpWithConfirmSchema,
    },
    onSubmit: async ({ value }) => {
      await signUpMutation({
        name: value.name,
        email: value.email,
        password: value.password,
      });
    },
  });

  const {
    mutateAsync: signUpMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: signUp,
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const handleSocialSignup = async (provider: "google" | "github") => {
    await signInSocial(provider);
  };

  return (
    <div className="bg-background my-32 flex items-center justify-center px-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-muted-foreground font-serif text-4xl">
            Ready to start?
          </h1>
          <h2 className="text-foreground font-serif text-5xl">
            Create your <span className="italic">account</span>.
          </h2>
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4">
            {error && (
              <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            )}

            {isSuccess ? (
              <div className="space-y-4">
                <div className="space-y-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Tick className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Account Created Successfully!
                      </p>
                      <p className="text-sm text-green-600/80 dark:text-green-400/80">
                        We&apos;ve sent a login email to{" "}
                        <span className="font-semibold">
                          {form.state.values.email}
                        </span>
                      </p>
                      <p className="pt-1 text-xs text-green-600/70 dark:text-green-400/70">
                        Please check your inbox and click the link to sign in
                        and verify your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-primary text-sm hover:underline"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <form.Field name="name">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>
                            <User />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          id="name"
                          type="text"
                          placeholder="John Doe"
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
                          value={field.state.value}
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

                <form.Field name="confirmPassword">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>
                            <Lock />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isPending}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            size="icon-xs"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? <EyeClose /> : <EyeOpen />}
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
                  {isPending ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            )}

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
                onClick={() => handleSocialSignup("google")}
              >
                <Google />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignup("github")}
              >
                <Github />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
