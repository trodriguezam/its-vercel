// src/components/TopicList.js
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import * as yup from 'yup';

const theme = createTheme();

const validationSchema = yup.object({
    email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es obligatorio'),
    password: yup.string()
      .matches(/^.{6,}$/, 'La contraseña debe tener 6 dígitos')
      .required('Contraseña es obligatoria'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirme su contraseña'),
  });

function LoginForm() {
    return (<ThemeProvider theme={theme}>
        <CssBaseline />
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, isValid, validateForm }) => {
            validateForm().then(errors => {
              if (Object.keys(errors).length) {
                alert('Por favor, corrija los errores antes de enviar.');
              } else {
                alert(JSON.stringify(values, null, 2));
                const user = {"user": values}
                axiosInstance.post('/signup', user)
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