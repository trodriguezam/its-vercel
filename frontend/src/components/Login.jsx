// src/components/LoginForm.js
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({

  palette: {
    primary: {
      main: '#666666',  // Example for primary color (green)
    },
    secondary: {
      main: '#FF5722',  // Example for secondary color (orange)
    },
    background: {
      default: '#F2FFF2',  // Light background color
    },
    text: {
      primary: '#111111',  // Custom text color
    }
  },
});

const validationSchema = yup.object({
    email: yup.string().email('invalid Email').required('Email is required'),
    password: yup.string()
      .matches(/^.{6,}$/, 'The password must be at least 6 characters')
      .required('Password is required'),
});

function LoginForm({ setCurrentUser }) { 
    const navigate = useNavigate(); 
  
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, validateForm }) => {
            validateForm().then(errors => {
              if (Object.keys(errors).length) {
                alert('Please correct the errors before submitting.');
              } else {
                const user = { "user": values };
  
                axiosInstance.post('/login', user)
                  .then((response) => {
                      const user = response.data.status.data.user;
                      localStorage.setItem('currentUser', JSON.stringify(user));
                      setCurrentUser(user); // Update currentUser state in App component
                      navigate('/topics'); // Redirect to topics after login
                  })
                  .catch(error => {
                      console.error("There was an error logging in!", error);
                    // Handle login error here, e.g., show a message to the user
                  });
              }
              setSubmitting(false);
            });
          }}
        >
          <Form >
            <Field
              as={TextField}
              name="email"
              type="text"
              label="Enter your email"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="email" component="div" />
  
            <Field
              as={TextField}
              name="password"
              type="password"
              label="Enter Password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="password" component="div" />
  
            <Button type="submit" sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }} variant="contained">
              Send
            </Button>
          </Form>
        </Formik>
      </ThemeProvider>
    );
}

export default LoginForm;
