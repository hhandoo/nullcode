import { useTime } from './TimeContext';
import { Typography, Box } from '@mui/material';

const TimeDisplay = () => {
    const { date, unixTimestamp, timezone } = useTime();

    return (
        <Box>
            <Typography variant='body2'>{date.toLocaleString()}</Typography>
            <Typography variant='body2'>{timezone}</Typography>
            <Typography variant='body2'>{unixTimestamp}</Typography>
        </Box>
    );
};

export default TimeDisplay;
