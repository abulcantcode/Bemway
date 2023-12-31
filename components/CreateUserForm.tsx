"use client";
import React, { useState } from "react";

const InputForm = () => {
  // Use state to handle inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  //update use state on change of the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // creates a post request. called on submition of the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("User created successfully");
        // Handle success, e.g., show a success message
      } else {
        console.error("User create failed");
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="bg-green-500 p-4 px-8 rounded-md w-fit flex flex-col items-center">
      <h2 className="font-bold text-xl underline underline-offset-4">
        Create User
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col mt-4 items-center">
        <label className="flex flex-col items-center gap-2">
          First Name:
          <input
            type="text"
            name="firstName"
            className="text-black rounded-md px-2 py-1"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <br />

        <label className="flex flex-col items-center gap-2">
          Last Name:
          <input
            type="text"
            name="lastName"
            className="text-black rounded-md px-2 py-1"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <br />

        <button className="bg-black py-2 px-4 rounded-md" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default InputForm;
