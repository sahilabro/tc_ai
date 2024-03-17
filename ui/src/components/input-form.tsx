import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { ENDPOINT } from '../api/endpoint';

interface GoNext {
  goNext: Function;
}
export function InputForm(props: GoNext) {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const data = JSON.stringify(formData);
    console.log(data); // You can send this JSON data to your server or perform other actions

    try {
      await fetch(ENDPOINT, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      });
      console.log("posted!");
      props.goNext(formData.title);
    } catch (e) {
      console.error(e);
    }
  };
  
  const dataOk = formData.title !== "" && formData.address !== "" && formData.description !== ""; 
  return (
    <Box
    component="form"
    sx={{
      '& > :not(style)': { m: 1, width: '25ch' },
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      // background: "red",
      alignItems: "center"
    }}
    noValidate
    autoComplete="off"
  >
      <TextField
        name="title"
        style = {{width: "50vw"}}
        fullWidth id="title-text" label="Title" variant="standard"
        onChange={handleChange} 
      />
      <TextField
                name="address"

        style = {{width: "50vw"}}
        fullWidth id="address-text" label="Address" variant="standard"
        onChange={handleChange} 
        />
      <TextField
        fullWidth
        name="description"
        style = {{width: "50vw"}}
        sx={{width: "1000px", }}
            id="description-test"
            label="Description"
            multiline
            maxRows={4}
        variant="standard"
        onChange={handleChange} 

      />
      <Button variant="contained" disabled={!dataOk} onClick={() => handleSubmit()} >Submit</Button>
  </Box>
  );
}
