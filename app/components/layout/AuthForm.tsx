"use client";
import { loginInSchema, signUpSchema } from "@/util/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import { FieldValues, Path, Resolver, useForm } from "react-hook-form";
import FormField from "../FormField";

interface Props<T extends FieldValues> {
  isSignup?: boolean;
  onSubmit: (data: T) => Promise<{ error: string } | void>;
}

const AuthForm = <T extends FieldValues>({ isSignup, onSubmit }: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = isSignup ? signUpSchema : loginInSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T>,
  });

  const submitHandler = async (data: T) => {
    setServerError(null);
    const result = await onSubmit(data);
    if (result?.error) setServerError(result.error);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
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

      <FormField label="Email address" error={errors.email?.message as string}>
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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="input w-full"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-white cursor-pointer"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOutlinedIcon fontSize="small" />
            )}
          </button>
        </div>
      </FormField>

      {serverError && (
        <p className="text-danger-100 text-sm text-center py-2 block">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        className="group btn-primary flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        <span>{isSignup ? "Create Account" : "Sign In"}</span>
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1.5">
          <ArrowForwardIcon fontSize="small" />
        </span>
      </button>
    </form>
  );
};

export default AuthForm;
