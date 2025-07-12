import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById } from '../../api/managerApi';
import { Container, Typography } from '@mui/material';

const TaskDetails = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        getTaskById(taskId).then(res => setTask(res.data));
    }, [taskId]);

    if (!task) return null;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5">{task.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{task.description}</Typography>
            <Typography variant="body2">Deadline: {task.deadline}</Typography>
            <Typography variant="body2">Assignee: {task.assigneeId}</Typography>
        </Container>
    );
};

export default TaskDetails;