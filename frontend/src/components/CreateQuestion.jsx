import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme, Typography, Box, IconButton, Select, MenuItem, Grid, FormControl, FormLabel, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const theme = createTheme({
  palette: {
    primary: { main: '#666666' },
    secondary: { main: '#FF5722' },
    background: { default: '#F2FFF2' },
    text: { primary: '#111111' }
  },
});

const validationSchema = yup.object({
  topic: yup.string().required('Tópico es obligatorio'),
  task: yup.string().required('Tarea es obligatoria'),
  question_text: yup.string().required('Texto de la pregunta es obligatorio'),
  correct_answer: yup.string().required('Debes seleccionar la respuesta correcta'),
});

function QuestionForm() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [top, tas] = await Promise.all([
                axiosInstance.get(`/topics`),
                axiosInstance.get('/tasks'),
            ]);

            setTopics(top.data);
            setTasks(tas.data);
        } catch (error) {
            console.error(error);
        } finally {
            setRender(true); // Set render to true after data fetching is complete
        }
    };
    fetchData();
}, []);

  if (!render) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!currentUser || currentUser.role !== 'professor') {
    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
            <Typography 
                variant="h3" 
                sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
            >
                Create Question
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
            >
                You are not authorized to view this page. Please log in as a professor.
            </Typography>
        </Box>
    );
}

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Crear Pregunta
      </Typography>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Formik
          initialValues={{
            topic: '',
            task: '',
            question_text: '',
            answers: ['', '', ''], 
            correct_answer: '',
            hint: '' 
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const questionResponse = await axiosInstance.post('/questions', {
                task_id: values.task,
                question_text: values.question_text, 
                hint: values.hint  
              });
              
              const questionId = questionResponse.data.id; 

              const answerPromises = values.answers.map((answer, index) => {
                return axiosInstance.post('/answers', {
                  question_id: questionId,  
                  answer_text: answer, 
                  correct: values.correct_answer === index.toString()
                });
              });

              // Wait for all answers to be created
              await Promise.all(answerPromises);

              // Navigate to the questions list or another page
              navigate('/dashboards');
            } catch (error) {
              console.error('There was an error submitting the question or answers!', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={4}>
                {/* Columna 1: Tópico, Tarea, Texto de la Pregunta */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="topic-label">Tópico</InputLabel>
                    <Select
                      labelId="topic-label"
                      name="topic"
                      value={values.topic}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('task', ''); // Reset task when topic changes
                      }}
                    >
                      {topics.map((topic) => (
                        <MenuItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <ErrorMessage name="topic" component="div" style={{ color: 'red' }} />

                  <FormControl fullWidth margin="normal" disabled={!values.topic}>
                    <InputLabel id="task-label">Tarea</InputLabel>
                    <Select
                      labelId="task-label"
                      name="task"
                      value={values.task}
                      onChange={handleChange}
                    >
                      {tasks
                        .filter((task) => task.topic_id === values.topic && task.task_type === 'Option')
                        .map((task) => (
                          <MenuItem key={task.id} value={task.id}>
                            {task.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <ErrorMessage name="task" component="div" style={{ color: 'red' }} />

                  <Field
                    type="text"
                    name="question_text"
                    as={TextField}
                    label="Texto de la Pregunta"
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                  />
                  <ErrorMessage name="question_text" component="div" style={{ color: 'red' }} />
                </Grid>

                {/* Columna 2: Respuestas dinámicas */}
                <Grid item xs={12} md={4}>
                  <FieldArray name="answers">
                    {({ push, remove, form }) => (
                      <>
                        {form.values.answers.map((answer, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <Field
                              type="text"
                              name={`answers[${index}]`}
                              as={TextField}
                              label={`Respuesta ${index + 1}`}
                              fullWidth
                              margin="normal"
                            />
                            {index >= 3 && (
                              <IconButton onClick={() => remove(index)} disabled={form.values.answers.length <= 3}>
                                <RemoveCircleOutlineIcon color="error" />
                              </IconButton>
                            )}
                          </div>
                        ))}
                        {form.values.answers.length < 5 && (
                          <Button
                            type="button"
                            onClick={() => push('')}
                            startIcon={<AddCircleOutlineIcon />}
                            variant="contained"
                            sx={{ mt: 2 }}
                          >
                            Agregar Respuesta
                          </Button>
                        )}
                      </>
                    )}
                  </FieldArray>
                </Grid>

                {/* Columna 3: Respuesta Correcta y Pista */}
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel>Respuesta Correcta</FormLabel>
                    <RadioGroup
                      name="correct_answer"
                      value={values.correct_answer}
                      onChange={handleChange}
                    >
                      {values.answers.map((answer, index) => (
                        <FormControlLabel
                          key={index}
                          value={index.toString()} // Use index directly
                          control={<Radio />}
                          label={`Respuesta ${index + 1}`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <ErrorMessage name="correct_answer" component="div" style={{ color: 'red' }} />
                  <Field
                    type="text"
                    name="hint"
                    as={TextField}
                    label="Pista (opcional)"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                  <ErrorMessage name="hint" component="div" style={{ color: 'red' }} />
                </Grid>
              </Grid>

              {/* Botón para Enviar */}
              <Box mt={4}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                >
                  Crear Pregunta
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </ThemeProvider>
  );
}

export default QuestionForm;
