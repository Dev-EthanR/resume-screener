"use client";

import FormField from "@/app/components/FormField";
import Toast from "@/app/components/Toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileData, profileSchema } from "@/util/schemas/profile.schema";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  defaultName: string;
  defaultEmail: string;
}

const ProfileForm = ({ defaultName, defaultEmail }: Props) => {
  const router = useRouter();
  const [justSaved, setJustSaved] = useState(false);
  const justSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (justSavedTimeoutRef.current) {
        clearTimeout(justSavedTimeoutRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: defaultName, email: defaultEmail },
  });

  const {
    mutate: updateProfile,
    isPending,
    error,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (data: ProfileData) => axios.patch("/api/settings", data),

    onSuccess: (_, variables) => {
      resetForm(variables);
      resetMutation();
      router.refresh();

      setJustSaved(true);
      if (justSavedTimeoutRef.current) {
        clearTimeout(justSavedTimeoutRef.current);
      }
      justSavedTimeoutRef.current = setTimeout(() => {
        setJustSaved(false);
        justSavedTimeoutRef.current = null;
      }, 2000);
    },
  });

  const serverError =
    error instanceof AxiosError
      ? (error.response?.data?.error ?? "Something went wrong")
      : null;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateProfile(data);
      })}
      className="flex flex-col"
    >
      <FormField label="Full Name" error={errors.name?.message}>
        <input {...register("name")} type="text" className="input" />
      </FormField>

      <FormField label="Email address" error={errors.email?.message}>
        <input {...register("email")} type="email" className="input" />
      </FormField>

      {serverError && (
        <p className="text-danger-100 text-sm mb-4">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary self-start text-sm"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>

      <Toast show={justSaved} message="Changes saved" />
    </form>
  );
};

export default ProfileForm;
