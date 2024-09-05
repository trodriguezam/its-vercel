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
    email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es obligatorio'),
    password: yup.string()
      .matches(/^.{6,}$/, 'La contraseña debe tener al menos 6 caracteres')
      .required('Contraseña es obligatoria'),
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
                alert('Por favor, corrija los errores antes de enviar.');
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
              label="Correo Electrónico"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="email" component="div" />
  
            <Field
              as={TextField}
              name="password"
              type="password"
              label="Contraseña"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="password" component="div" />
  
            <Button type="submit" color="primary" variant="contained">
              Enviar
            </Button>
          </Form>
        </Formik>
      </ThemeProvider>
    );
}

export default LoginForm;
