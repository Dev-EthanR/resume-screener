"use client";
import AuthForm from "@/app/components/layout/AuthForm";
import { LoginType, loginInSchema } from "@/lib/schemas/auth.schema";
const SignInPage = () => {
  return (
    <AuthForm<LoginType>
      schema={loginInSchema}
      onSubmit={(data) => console.log(data)}
      title="Welcome back"
      subTitle="Sign in to pick up where you left off."
    />
  );
};

export default SignInPage;
