import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Divider,
    CircularProgress
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { fetchCurrentUser, updateUser } from '../api/userApi';
const ManageProfile = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await fetchCurrentUser();
                setProfile({ name: user.name, email: user.email });
            } catch (err) {
                enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            }
        };
        loadUser().then();
    }, [enqueueSnackbar]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            await updateUser({
                name: profile.name,
                email: profile.email,
                password: ''
            });
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoadingPassword(true);
        try {
            await updateUser({
                name: profile.name,
                email: profile.email,
                password: passwords.newPassword
            });
            enqueueSnackbar('Password changed successfully', { variant: 'success' });
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Manage Profile
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Update Name & Email
                </Typography>
                <Box component="form" onSubmit={handleProfileUpdate}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loadingProfile}
                    >
                        {loadingProfile ? <CircularProgress size={20} /> : 'Update Profile'}
                    </Button>
                </Box>
            </Paper>

            <Divider />

            <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Change Password
                </Typography>
                <Box component="form" onSubmit={handlePasswordUpdate}>
                    <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loadingPassword}
                    >
                        {loadingPassword ? <CircularProgress size={20} /> : 'Change Password'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ManageProfile;