import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, TextField, Typography, Container, Box, FormControl, FormHelperText } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';

const Captcha = () => {
  const home_url="http://localhost:3000/";
  const [captcha, setCaptcha] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(Math.random().toString(36).slice(2, 8));
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    captcha: Yup.string()
      .required("Captcha is required")
      .oneOf([captcha], "Captcha is incorrect"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (values.captcha === captcha) {
      setSuccess(true);
      resetForm();
      refreshCaptcha();
      console.log(values)
    } else {
      setSuccess(false);
    }
  };

  return (
   <>
<Link to={home_url}  class="inline-flex text-black bg-primary-600">Back to Homepage</Link>

    <Container
      maxWidth="xs"
      sx={{
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Captcha
        </Typography>
        {success && (
          <Alert severity="success" >
            Captcha verified successfully
          </Alert>
        )}
        <Typography variant="h6" gutterBottom>
          {captcha}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={refreshCaptcha}
          
        >
          Refresh Captcha
        </Button>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            captcha: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur }) => (
            <Form>
              <FormControl fullWidth margin="normal">
                <Typography variant="subtitle1">First Name</Typography>
                <Field
                  as={TextField}
                  name="firstName"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText error>
                  <ErrorMessage name="firstName" />
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Typography variant="subtitle1">Last Name</Typography>
                <Field
                  as={TextField}
                  name="lastName"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText error>
                  <ErrorMessage name="lastName" />
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Typography variant="subtitle1">Email</Typography>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText error>
                  <ErrorMessage name="email" />
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Typography variant="subtitle1">Enter Captcha</Typography>
                <Field
                  as={TextField}
                  name="captcha"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText error>
                  <ErrorMessage name="captcha" />
                </FormHelperText>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container></>
  );
};

export default Captcha;
