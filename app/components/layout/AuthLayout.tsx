import ButtonTab from "@/app/components/ButtonTab";
import OAuth from "@/app/components/layout/OAuth";

interface Props {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

const AuthLayout = ({ title, subTitle, children }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-4 space-y-2 w-full">
        <h1 className="font-bold text-white text-3xl">{title}</h1>
        <p className="text-sm max-w-xs">{subTitle}</p>
      </div>
      <div className="bg-background p-2 rounded-lg flex gap-2 items-center mb-4 border-border border">
        <ButtonTab href="/auth/signin" label="Sign In" />
        <ButtonTab href="/auth/register" label="Create Account" />
      </div>
      {children}
      <div className="flex items-center justify-between w-full py-6">
        <div className="w-full h-0.5 bg-background" />
        <span className="text-xs px-2">or</span>
        <div className="w-full h-0.5 bg-background" />
      </div>
      <OAuth provider="google" />
    </div>
  );
};

export default AuthLayout;
