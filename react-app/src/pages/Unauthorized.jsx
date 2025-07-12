import { Container, Typography } from '@mui/material';

const Unauthorized = () => {
    return (
        <Container sx={{ mt: 10 }}>
            <Typography variant="h4" color="error" align="center">
                403 - Unauthorized Access
            </Typography>
            <Typography variant="body1" align="center">
                You are not authorized to view this page.
            </Typography>
        </Container>
    );
};

export default Unauthorized;