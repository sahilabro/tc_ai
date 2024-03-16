import React, { useState } from "react";

export function InputForm() {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.description = "fake description";
    const data = JSON.stringify(formData);

    console.log(JSON.stringify(formData)); // You can send this JSON data to your server or perform other actions

    try {
      await fetch("http://127.0.0.1:8000/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="address">Address:</label>
        <br />
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <br />
        <br />

        {/* <label htmlFor="description">Description:</label><br /> */}
        {/* <textarea id="description" name="description"  value={formData.description} onChange={handleChange}></textarea><br /><br /> */}

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
