import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const theme = createTheme({
  palette: {
    primary: { main: '#666666' },
    secondary: { main: '#FF5722' },
    background: { default: '#F2FFF2' },
    text: { primary: '#111111' }
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
  role: yup.string().oneOf(['user', 'professor'], 'Invalid role').required('Role is required')
});

function SignupForm() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Registrate
      </Typography>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Formik
          initialValues={{ email: '', password: '', password_confirmation: '', role: 'user' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const user = { user: values };
            axiosInstance.post('/signup', user)
              .then(response => {
                navigate('/login');
              })
              .catch(error => {
                console.error('There was an error!', error);
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form>
              <Field
                type="email"
                name="email"
                as={TextField}
                label="Correo Electrónico"
                fullWidth
                margin="normal"
                sx={{ boxSizing: 'border-box' }}
              />
              <ErrorMessage name="email" component="div" style={{ minHeight: '20px', color: 'red' }} />

              <Field
                type="password"
                name="password"
                as={TextField}
                label="Contraseña"
                fullWidth
                margin="normal"
                sx={{ boxSizing: 'border-box' }}
              />
              <ErrorMessage name="password" component="div" style={{ minHeight: '20px', color: 'red' }} />

              <Field
                type="password"
                name="password_confirmation"
                as={TextField}
                label="Confirmar Contraseña"
                fullWidth
                margin="normal"
                sx={{ boxSizing: 'border-box' }}
              />
              <ErrorMessage name="password_confirmation" component="div" style={{ minHeight: '20px', color: 'red' }} />

              <FormControl fullWidth margin="normal">
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="professor">Professor</MenuItem>
                </Select>
              </FormControl>
              <ErrorMessage name="role" component="div" style={{ color: 'red' }} />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
              >
                Registrate
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </ThemeProvider>
  );
}

export default SignupForm;
