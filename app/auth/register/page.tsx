import { registerAction } from "@/util/authActions";
import AuthForm from "@/app/components/layout/AuthForm";
import AuthLayout from "@/app/components/layout/AuthLayout";
import { SignUpType } from "@/util/schemas/auth.schema";

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create your account"
      subTitle="Start analyzing your resume. No credit card needed."
    >
      <AuthForm<SignUpType> onSubmit={registerAction} isSignup />
    </AuthLayout>
  );
};

export default RegisterPage;
