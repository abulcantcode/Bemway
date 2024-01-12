"use client";

import { useState } from "react";
import Input from "../Shared/Input";
import BackendRequest from "@/utils/backend";
import { useRouter } from "next/navigation";
import classNames from "classnames";

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { push } = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmitting(true);
    e.preventDefault();

    try {
      const response = await BackendRequest.post("user/auth", formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.statusText === "OK") {
        console.log("User logged in successfully");
        setInvalid(false);
        push("/dashboard");
      } else {
        const error = response.data;
        console.error("User auth failed", error);
        setInvalid(true);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setInvalid(true);
      }
      console.error("Error:", error);
    }
    setSubmitting(false);
  };

  /* 
  
  We need have
  some functionality
  To automatically direct the user
  to dashboard if they already are logged in (session has not expired)

  We also need some functionality to push the user to / if they do not have a valid session
  AND in doing so we must delete their current session (maybe can do on the API side and do checking on layout.tsx)
  
  */

  return (
    <div
      className={classNames(
        "dark:bg-neutral-100 bg-slate-700 dark:bg-opacity-10 bg-opacity-20",
        "pt-4 pb-6 px-8 min-w-fit w-2/3 flex flex-col items-center min-h-screen justify-center",
        "text-black dark:text-white"
      )}
    >
      <h2 className="font-bold text-2xl mb-8">Log in to your account</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-[516px]"
      >
        <Input
          label="Email"
          type="text"
          name="email"
          labelProps={{ className: "w-full dark:text-gray-300" }}
          value={formData.email}
          onChange={handleChange}
          required
          disabled={submitting}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          labelProps={{ className: "w-full dark:text-gray-300" }}
          value={formData.password}
          onChange={handleChange}
          required
          disabled={submitting}
        />
        <label className="flex items-center gap-2 w-full text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
            disabled={submitting}
          />{" "}
          Show password
        </label>

        <button
          className="bg-black text-white font-semibold py-2 px-4 rounded-md mt-8 w-full"
          type="submit"
          disabled={submitting}
        >
          Log in
        </button>
      </form>
      <h3
        className={classNames("text-red-500 font-semibold mt-4", {
          invisible: !invalid,
        })}
      >
        The username and password is invalid. Please try again.
      </h3>
      <a href="/" className="font-bold text-lg mt-4 mb-8">
        Don&apos;t have an account yet? <b className="underline">Sign up</b>.
      </a>
    </div>
  );
}
