// src/components/TopicList.js
import { Component, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import * as yup from 'yup';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
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
    email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es obligatorio'),
    password: yup.string()
      .matches(/^.{6,}$/, 'La contraseña debe tener 6 dígitos')
      .required('Password is required'),  
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Please confirm your password'),
  });

function SignupForm() {
    const navigate = useNavigate();

    return (
    <>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Formik
          initialValues={{
            email: '',
            password: '',
            password_confirmation: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, isValid, validateForm }) => {
            validateForm().then(errors => {
              if (Object.keys(errors).length) {
                alert('Please correct the errors before submitting.');
              } else {
                alert('User created successfully'); 
                const user = {"user": values}
                axiosInstance.post('/signup', user)
                .then(() => {
                  navigate('/login');
                }
                )
              }
              setSubmitting(false);
            });
          }}
        >
          <Form>
    
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

            <Field
              as={TextField}
              name="password_confirmation"
              type="password"
              label="Confirm Password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="password_confirmation" component="div" />
    
            <Button type="submit" sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }} variant="contained">
              Send
            </Button>
            <Link to="/login"/>
            <Button component={Link} to='/login'></Button>
          </Form>
        </Formik>
      </ThemeProvider>
      </>
    ); 
}
export default SignupForm;