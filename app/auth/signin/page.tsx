import { loginAction } from "@/util/authActions";
import AuthForm from "@/app/components/layout/AuthForm";
import AuthLayout from "@/app/components/layout/AuthLayout";
import { LoginType } from "@/util/schemas/auth.schema";

const SignInPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subTitle="Sign in to pick up where you left off."
    >
      <AuthForm<LoginType> onSubmit={loginAction} />
    </AuthLayout>
  );
};

export default SignInPage;
