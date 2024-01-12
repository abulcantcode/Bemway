"use client";
import React, { LegacyRef, MouseEvent, useRef, useState } from "react";
import axios from "axios";
import Input from "../Shared/Input";
import { ProfileColor, TProfileColor } from "@/utils/profileColor";
import UserProfile from "../User/UserProfile";
import classNames from "classnames";
import BackendRequest from "@/utils/backend";
import getConfig from "next/config";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profile: "BLUE" as TProfileColor,
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { push } = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmitting(true);
    e.preventDefault();

    try {
      const response = await BackendRequest.post("user/create", formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.statusText === "OK") {
        console.log("User created successfully");
        setError({});
        setServerError(false);
        push("/dashboard");
      } else {
        const error = response.data;
        console.error("User create failed", error);
        setError(error);
      }
    } catch (error: any) {
      if (error?.response) {
        setError(error?.response?.data);
      } else {
        setServerError(true);
      }
      console.error("Error:", error, error);
      setSubmitting(false);
    }
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
    <div className="bg-neutral-100 pt-4 pb-6 px-8 min-w-fit w-2/3 flex flex-col items-center min-h-screen justify-center">
      <h2 className="font-bold text-2xl mb-8 text-black">Create an account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex md:gap-4 w-full md:flex-row flex-col">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={submitting}
            labelProps={{ className: "w-full min-w-[200px]" }}
            errorByName={error}
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={submitting}
            errorByName={error}
            labelProps={{ className: "w-full min-w-[200px]" }}
          />
        </div>

        <Input
          label="Email"
          type="text"
          name="email"
          labelProps={{ className: "w-full" }}
          value={formData.email}
          onChange={handleChange}
          required
          disabled={submitting}
          errorByName={error}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          labelProps={{ className: "w-full" }}
          value={formData.password}
          onChange={handleChange}
          required
          errorByName={error}
          disabled={submitting}
        />
        <label className="flex items-center gap-2 w-full text-sm text-black cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
            disabled={submitting}
          />{" "}
          Show password
        </label>
        <div className="w-full">
          <h3 className="mt-4 mb-2 text-black">Select a profile colour:</h3>
          <div className="flex flex-wrap gap-1">
            {ProfileColor.map((profile, index) => (
              <div
                key={`profile-${index}`}
                onClick={() =>
                  !submitting &&
                  setFormData((prevFormData) => ({ ...prevFormData, profile }))
                }
                className={classNames("p-0.5 border-2", {
                  "border-transparent": profile !== formData?.profile,
                  "border-black": profile === formData?.profile,
                  "cursor-not-allowed opacity-50": submitting,
                  "cursor-pointer": !submitting,
                })}
              >
                <UserProfile
                  firstName={formData?.firstName}
                  lastName={formData?.lastName}
                  profile={profile as TProfileColor}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="bg-black py-2 px-4 rounded-md mt-8 w-full"
          type="submit"
          disabled={submitting}
        >
          Sign up
        </button>
      </form>
      <h3
        className={classNames("text-red-500 font-semibold mt-4", {
          invisible: !serverError,
        })}
      >
        Internal server error. Please try again.
      </h3>
      <a href="/auth" className="font-bold text-lg mt-4 mb-8 text-black">
        Or, if you already have an account <b className="underline">log in</b>.
      </a>
    </div>
  );
};

export default SignupForm;
