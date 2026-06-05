"use client";
import AuthForm from "@/app/components/layout/AuthForm";
import { signUpSchema, SignUpType } from "@/lib/schemas/auth.schema";
const SignInPage = () => {
  return (
    <AuthForm<SignUpType>
      schema={signUpSchema}
      onSubmit={(data) => console.log(data)}
      title="Create your account"
      subTitle="Start analyzing your resume. No credit card needed."
      isSignup
    />
  );
};

export default SignInPage;
