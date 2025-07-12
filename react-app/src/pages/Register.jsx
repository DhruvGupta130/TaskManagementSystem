import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    Link,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import loginApi from "../api/loginApi.js";

const Register = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, password, role } = form;
        if (!name || !email || !password || !role) {
            enqueueSnackbar('Please fill all the fields.', { variant: 'warning' });
            return;
        }

        setLoading(true);

        try {
            const res = await loginApi.post('/auth/register', form);
            enqueueSnackbar(res.data.data.message || 'Registered successfully!', {
                variant: 'success'
            });

            setTimeout(() => navigate('/login'), 500);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ padding: 5, mt: 10, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                    Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" mb={3}>
                    Enter your details to register
                </Typography>

                <Box component="form" onSubmit={handleRegister} noValidate>
                    <TextField
                        label="Full Name"
                        name="name"
                        fullWidth
                        required
                        margin="normal"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        required
                        margin="normal"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        fullWidth
                        required
                        margin="normal"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth required margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={form.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="MANAGER">Manager</MenuItem>
                            <MenuItem value="WORKER">Worker</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </Box>

                <Typography variant="body2" align="center" mt={2}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" underline="hover">
                        Login here
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Register;