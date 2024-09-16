import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';



function HomePage(){

    return (
        <div>
            <Typography variant="h2" color="#111111">Home</Typography>
        </div>
    )
}

export default HomePage;
    