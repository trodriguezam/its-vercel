// src/components/LoginForm.js
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme, Grid, Typography, Box, Divider } from '@mui/material';
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
    },
  },
});

const validationSchema = yup.object({
  email: yup.string().email('Invalid Email').required('Email is required'),
  password: yup.string()
    .matches(/^.{6,}$/, 'The password must be at least 6 characters')
    .required('Password is required'),
});

function LoginForm({ setCurrentUser }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosInstance.get('/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center" maxWidth="lg">
          {/* Student Login Form */}
          <Grid item xs={12} sm={5}>
            <Typography variant="h5" gutterBottom>
              Student Login
            </Typography>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, validateForm }) => {
                validateForm().then(errors => {
                  if (Object.keys(errors).length) {
                    alert('Please correct the errors before submitting.');
                  } else {

                    if (users.find((user) => user.email === values.email && user.role === "user")) {
                    const userdata = { "user": values };
      
                    axiosInstance.post('/login', userdata)
                      .then((response) => {
                          const user = response.data.status.data.user;
                          localStorage.setItem('currentUser', JSON.stringify(user));
                          
                          const time = new Date();
                          localStorage.setItem('LoginTime', time.toISOString());

                          setCurrentUser(user); 
                          navigate('/topics');
                      })
                      .catch(error => {
                          console.error("There was an error logging in!", error);
                        // Handle login error here, e.g., show a message to the user
                      });
                  }
                  else {
                    alert('User not found');
                  }
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

                <Button
                  type="submit"
                  sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                  variant="contained"
                  fullWidth
                >
                  Login as Student
                </Button>
              </Form>
            </Formik>
          </Grid>

          {/* Vertical Line Separator */}
          <Grid item xs="auto">
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderRightWidth: 2,
                borderColor: '#666666', // Set a visible color for the separator
                height: '100%',
              }}
            />
          </Grid>

          {/* Professor Login Form */}
          <Grid item xs={12} sm={5}>
            <Typography variant="h5" gutterBottom>
              Professor Login
            </Typography>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, validateForm }) => {
                validateForm().then(errors => {
                  if (Object.keys(errors).length) {
                    alert('Please correct the errors before submitting.');
                  } else {

                    if (users.find((user) => user.email === values.email && user.role === "professor")) {
                    const userdata = { "user": values };
      
                    axiosInstance.post('/login', userdata)
                      .then((response) => {
                          const user = response.data.status.data.user;
                          localStorage.setItem('currentUser', JSON.stringify(user));

                          const time = new Date();
                          localStorage.setItem('LoginTime', time.toISOString());

                          setCurrentUser(user);
                          navigate('/dashboards'); 
                      })
                      .catch(error => {
                          console.error("There was an error logging in!", error);
                        // Handle login error here, e.g., show a message to the user
                      });
                  }
                  else {
                    alert('User not found');
                  }
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

                <Button
                  type="submit"
                  sx={{ backgroundColor: '#FF5722', '&:hover': { backgroundColor: '#E64A19' } }}
                  variant="contained"
                  fullWidth
                >
                  Login as Professor
                </Button>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default LoginForm;
