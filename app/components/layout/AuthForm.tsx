"use client";
import { useState } from "react";
import Link from "next/link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FieldValues, useForm, Resolver, Path } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import FormField from "../FormField";

const details = {
  signIn: { name: "Sign In" },
  signUp: { name: "Create Account" },
};

interface Props<T extends FieldValues> {
  title: string;
  subTitle: string;
  isSignup?: boolean;
  onSubmit: (data: T) => void;
  schema: ZodType<T, T>;
}

const AuthForm = <T extends FieldValues>({
  subTitle,
  title,
  isSignup,
  schema,
  onSubmit,
}: Props<T>) => {
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();

  const authObj = details[isSignup ? "signUp" : "signIn"];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-4 space-y-2 w-full">
        <h1 className="font-bold text-white text-3xl ">{title}</h1>
        <p className="text-sm max-w-xs">{subTitle}</p>
      </div>
      <div className="bg-background p-2 rounded-lg flex gap-2 items-center mb-4 border-border border">
        <Link
          href="/auth/signin"
          className={clsx(
            "btn-auth  ",
            pathname === "/auth/signin" ? "bg-accent" : "hover:bg-gray-800 ",
          )}
        >
          {details.signIn.name}
        </Link>
        <Link
          href="/auth/register"
          className={clsx(
            "btn-auth  ",
            pathname === "/auth/register" ? "bg-accent" : "hover:bg-gray-800 ",
          )}
        >
          {details.signUp.name}
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-1"
      >
        {isSignup && (
          <FormField label="Name" error={errors.name?.message as string}>
            <input
              {...register("name" as Path<T>)}
              type="text"
              placeholder="Alex Rivera"
              className="input"
            />
          </FormField>
        )}

        <FormField
          label="Email address"
          error={errors.email?.message as string}
        >
          <input
            {...register("email" as Path<T>)}
            type="email"
            placeholder="you@example.com"
            className="input"
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message as string}>
          <div className="relative">
            <input
              {...register("password" as Path<T>)}
              type={toggle ? "text" : "password"}
              placeholder="••••••••"
              className="input w-full"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-white cursor-pointer"
              onClick={() => setToggle((p) => !p)}
            >
              {toggle ? (
                <VisibilityOffOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )}
            </button>
          </div>
        </FormField>

        <button
          type="submit"
          className="group btn-primary flex items-center justify-center gap-2"
        >
          <span>{authObj.name}</span>
          <span className="transition-transform duration-200 ease-out group-hover:translate-x-1.5">
            <ArrowForwardIcon fontSize="small" />
          </span>
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
