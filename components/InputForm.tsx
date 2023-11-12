"use client";
import React, { useState } from "react";

const InputForm = () => {
  // Use state to handle inputs
  const [formData, setFormData] = useState({
    name: "",
    location: "",
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
      const response = await fetch("http://localhost:13000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Request successful");
        // Handle success, e.g., show a success message
      } else {
        console.error("Request failed");
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <section>
      <h2>Input Form</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <br />

        <label>
          Location:
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={handleChange}
          />
        </label>

        <br />

        <button type='submit'>Submit</button>
      </form>
    </section>
  );
};

export default InputForm;
