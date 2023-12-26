"use client";
import React, { useState } from "react";

const TaskForm = () => {
  // Use state to handle inputs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  //update use state on change of the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Task created successfully");
        // Handle success, e.g., show a success message
      } else {
        console.error("Task create failed");
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className=''>
      <h2>Create Task</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type='text'
            name='title'
            className='text-black'
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <br />

        <label>
          Description:
          <input
            type='text'
            name='description'
            className='text-black'
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <br />

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default TaskForm;
