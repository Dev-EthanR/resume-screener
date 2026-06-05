"use client";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";

type Provider = "google";

const providerConfig: Record<
  Provider,
  { icon: React.ReactNode; label: string }
> = {
  google: {
    icon: <GoogleIcon fontSize="small" />,
    label: "Continue with Google",
  },
};

interface Props {
  provider: Provider;
  redirectTo?: string;
}

const OAuth = ({ provider, redirectTo = "/dashboard" }: Props) => {
  const { icon, label } = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={() => signIn(provider, { redirectTo })}
      className="btn-outline w-full flex items-center justify-center gap-2 py-2.5 font-semibold"
    >
      {icon}
      {label}
    </button>
  );
};

export default OAuth;
