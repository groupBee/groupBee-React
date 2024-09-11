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
    const [infoData, setInfoData] = useState([]);


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
                    content: params.get('content') || ''
                };
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
            console.log(data)


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
            return dateString; // 원본 문자열 반환
        }
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
                        <Typography variant="subtitle2" color="textSecondary">발신자</Typography>
                    </Grid>
                    <Grid item xs={12} sm={11}>
                        <Typography>{decodeURIComponent(email.from)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle2" color="textSecondary">수신자</Typography>
                    </Grid>
                    <Grid item xs={12} sm={11}>
                        <Typography>{infoData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle2" color="textSecondary">수신일</Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography>{formatDate(decodeURIComponent(email.receivedDate))}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ margin: '16px 0' }} />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', marginTop: 2 ,height:'600px',marginLeft:'5%'}}>
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