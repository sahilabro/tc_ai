import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import {
  createTheme,
  ThemeProvider,
  Theme,
  useTheme,
} from "@mui/material/styles";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { ENDPOINT } from "../api/endpoint";

interface GoNext {
  goNext: Function;
}

const customTheme = (theme: Theme) => {
  const themeOverrides = {
    pallete: {
      primary: {
        main: "green",
      },
      secondary: {
        main: "red",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "red",
            "--TextField-brandBorderHoverColor": "red",
            "--TextField-brandBorderFocusedColor": "red",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  };

  const newTheme = createTheme({ ...theme, ...themeOverrides });
  return newTheme;
};

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

  const dataOk =
    formData.title !== "" &&
    formData.address !== "" &&
    formData.description !== "";

  const theme = useTheme();

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        // background: "red",
        alignItems: "center",
        marginTop: "32px"
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        sx={{
          "& .MuiInputLabel-root.Mui-focused": { color: "#66bb6a" },
          "& .MuiInput-underline:before": { borderBottomColor: "#2b2b2b" },
          "& .MuiInput-underline:after": { borderBottomColor: "#66bb6a" },
        }}
        name="title"
        style={{ width: "50vw" }}
        fullWidth
        id="title-text"
        label="Property Title"
        variant="standard"
        onChange={handleChange}
      />
      <TextField
        sx={{
          "& .MuiInputLabel-root.Mui-focused": { color: "#66bb6a" },
          "& .MuiInput-underline:before": { borderBottomColor: "#2b2b2b" },
          "& .MuiInput-underline:after": { borderBottomColor: "#66bb6a" },
        }}
        name="address"
        style={{ width: "50vw" }}
        fullWidth
        id="address-text"
        label="Address"
        variant="standard"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        name="description"
        style={{ width: "50vw" }}
        sx={{
          "& .MuiInputLabel-root.Mui-focused": { color: "#66bb6a" },
          "& .MuiInput-underline:before": { borderBottomColor: "#2b2b2b" },
          "& .MuiInput-underline:after": { borderBottomColor: "#66bb6a" },
        }}
        id="description-test"
        label="Description"
        multiline
        maxRows={4}
        variant="standard"
        onChange={handleChange}
      />
      <Button
        sx={{
          background: "#2b2b2b",
          ":hover": {
            background: "#66bb6a",
          },
        }}
        variant="contained"
        disabled={!dataOk}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </Box>
  );
}
