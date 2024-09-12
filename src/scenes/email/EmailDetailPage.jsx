import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Divider,
    Container,
    Grid,
    Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ padding: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">Something went wrong.</Typography>
                    <Typography variant="body1">{this.state.error.toString()}</Typography>
                </Box>
            );
        }

        return this.props.children;
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const EmailHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const EmailAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(2),
}));

function EmailDetailPage() {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [infoData, setInfoData] = useState({});
    const [isSentEmail, setIsSentEmail] = useState(false);

    useEffect(() => {
        const fetchEmailDetails = () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching email details for id:", id);
                console.log("URL search params:", location.search);

                const params = new URLSearchParams(location.search);
                const emailData = {
                    id,
                    subject: params.get('subject') || '',
                    from: params.get('from') || '',
                    to: params.get('to') || '',
                    cc: params.get('cc') || '',
                    receivedDate: params.get('receivedDate') || '',
                    sentDate: params.get('sentDate') || '',
                    content: params.get('content') || ''
                };
                setIsSentEmail(params.get('isSentEmail') === 'true');
                console.log("Parsed email data:", emailData);

                setEmail(emailData);
            } catch (err) {
                console.error("Error fetching email details:", err);
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchEmailDetails();
    }, [id, location.search]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employee/info');
            const data = await response.json();
            setInfoData(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            }).format(date);
        } catch (err) {
            console.error("Error formatting date:", err);
            return dateString;
        }
    };

    const formatDate2 = (dateString) => {
        if (!dateString) return '';

        const parseDateString = (str) => {
            const parts = str.split(' ');
            const [, month, day, time, , year] = parts;
            const [hour, minute, second] = time.split(':');

            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };

            return new Date(year, monthMap[month], day, hour, minute, second);
        };

        const date = parseDateString(dateString);

        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateString);
            return '날짜 형식 오류';
        }

        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        const options = isToday
            ? { hour: '2-digit', minute: '2-digit', hour12: false }
            : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };

        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h5" color="error">이메일 로딩 중 오류 발생</Typography>
                <Typography variant="body1">{error}</Typography>
            </Container>
        );
    }

    if (!email) {
        return (
            <Container maxWidth="md">
                <Typography>이메일을 불러올 수 없습니다.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/email')}
                sx={{ marginTop: 3, marginBottom: 2}}
            >
                목록으로 돌아가기
            </Button>
            <StyledPaper>
                <EmailHeader style={{marginLeft:'5%'}}>
                    <EmailAvatar>
                        <EmailIcon />
                    </EmailAvatar>
                    <Typography variant="h4" component="h1">
                        {decodeURIComponent(email.subject)}
                    </Typography>
                </EmailHeader>
                <Divider sx={{ marginBottom: 2 }} />
                <Grid container spacing={2} style={{marginLeft:'5%'}}>
                    <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {isSentEmail ? "수신자" : "발신자"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={11}>
                        <Typography>
                            {isSentEmail ? decodeURIComponent(email.to) : decodeURIComponent(email.from)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {isSentEmail ? "발신자" : "수신자"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={11}>
                        <Typography>
                            {isSentEmail ? infoData.email : infoData.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {isSentEmail ? "발신일" : "수신일"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography>
                            {isSentEmail ? formatDate2(decodeURIComponent(email.sentDate)) : formatDate(email.receivedDate)}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ margin: '16px 0' }} />
                <Typography variant="body1"
                            sx={{ whiteSpace: 'pre-wrap',
                                marginTop: 2 ,
                                height:'600px',
                                marginLeft:'5%',
                                marginRight:'5%',
                                border:'1px solid #dddd',
                                borderRadius:'4px',
                                padding:'2%'
                }}>
                    {decodeURIComponent(email.content)}
                </Typography>
            </StyledPaper>
        </Container>
    );
}

function WrappedEmailDetailPage() {
    return (
        <ErrorBoundary>
            <EmailDetailPage />
        </ErrorBoundary>
    );
}

export default WrappedEmailDetailPage;