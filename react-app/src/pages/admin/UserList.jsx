import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
} from '@mui/material';
import api from '../../api/api';

const UserList = () => {
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (type) => {
        setLoading(true);
        try {
            const response = await api.get(`/users/admin/${type}`);
            setUsers(response.data || []);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(tab === 0 ? 'workers' : 'managers');
    }, [tab]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                User Directory
            </Typography>

            <Paper sx={{ mb: 2 }}>
                <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
                    <Tab label="Workers" sx={{ mx: 5 }} />
                    <Tab label="Managers" sx={{ mx: 5 }} />
                </Tabs>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>User ID</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.id}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default UserList;