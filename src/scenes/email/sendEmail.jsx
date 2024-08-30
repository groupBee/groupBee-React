import { Box, Button, Chip, TextField, Alert, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import GroupModal from '../../components/groupModal';
import axios from 'axios';

const SendEmail = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [to, setTo] = useState([]);  // To 필드를 배열로 변경
    const [cc, setCc] = useState([]);  // CC 필드를 배열로 변경
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [toInput, setToInput] = useState('');  
    const [ccInput, setCcInput] = useState('');  
    const [targetField, setTargetField] = useState(null); 
    const [modalOpen, setModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);  // 오류 모달 상태 추가
    const [errorMessage, setErrorMessage] = useState('');  // 오류 메시지 상태 추가

    const getinfo = () => {
        axios.get("/api/employee/auth/email")
            .then(res => {
                setUsername(res.data.email)
                setPassword(res.data.password)
            })
    }

    const openModal = (field) => {
        setTargetField(field); 
        setModalOpen(true);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();

        const emailData = {
            to,
            cc,
            subject,
            body,
        };

        try {
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (response.ok) {
                alert('메일이 성공적으로 전송되었습니다!');
                window.location.reload();
            } else {
                const result = await response.json();
                setErrorMessage(result.error);  // 오류 메시지 설정
                setErrorModalOpen(true);  // 오류 모달 열기
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setErrorMessage('Failed to send email: ' + error.message);
            setErrorModalOpen(true);  // 오류 모달 열기
        }
    };

    const handleModalSelect = (value) => {
        if (targetField === 'to') {
            setTo(prev => [...prev, value.email]);
        } else if (targetField === 'cc') {
            setCc(prev => [...prev, value.email]);
        }
    };

    const handleDelete = (email, field) => {
        if (field === 'to') {
            setTo(prev => prev.filter(e => e !== email));
        } else if (field === 'cc') {
            setCc(prev => prev.filter(e => e !== email));
        }
    };

    const handleAddEmail = (field) => {
        if (field === 'to' && toInput.trim()) {
            setTo(prev => [...prev, toInput]);
            setToInput('');
        } else if (field === 'cc' && ccInput.trim()) {
            setCc(prev => [...prev, ccInput]);
            setCcInput('');
        }
    };

    useEffect(() => {
        getinfo();
    }, []);

    return (
        <div>
            <h2 style={{ marginTop: '20px' }}>메일 보내기</h2>
            <form onSubmit={handleSendEmail}>
                <hr />
                <b>받는사람</b>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', width: '700px' }}>
                        {to.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDelete(email, 'to')}
                                sx={{ marginBottom: '5px' }}
                            />
                        ))}
                    </Box>
                    <Button variant='contained' color='warning' onClick={() => openModal('to')}>
                        찾아보기
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField
                        value={toInput}
                        onChange={(e) => setToInput(e.target.value)}
                        placeholder="이메일 추가"
                        variant="outlined"
                        size="small"
                        sx={{ width: '700px' }}
                    />
                    <Button variant='contained' color='primary' onClick={() => handleAddEmail('to')}>
                        추가
                    </Button>
                </Box>
                <b>참조</b>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', width: '700px' }}>
                        {cc.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDelete(email, 'cc')}
                                sx={{ marginBottom: '5px' }}
                            />
                        ))}
                    </Box>
                    <Button variant='contained' color='warning' onClick={() => openModal('cc')}>
                        찾아보기
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField
                        value={ccInput}
                        onChange={(e) => setCcInput(e.target.value)}
                        placeholder="참조 이메일 추가"
                        variant="outlined"
                        size="small"
                        sx={{ width: '700px' }}
                    />
                    <Button variant='contained' color='primary' onClick={() => handleAddEmail('cc')}>
                        추가
                    </Button>
                </Box>
                <b>제목</b>
                <TextField
                    fullWidth
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                />
                <b>내용</b>
                <textarea
                    style={{ width: '700px', height: '400px', marginTop: '10px' }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Your message"
                />
                <br />
                <button type="submit" style={{ marginTop: '10px' }}>Send</button>
            </form>
            <GroupModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleModalSelect}
            />

            {/* 오류 모달 창 */}
            <Modal
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                aria-labelledby="error-modal-title"
                aria-describedby="error-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="error-modal-title" variant="h6" component="h2">
                        메일 주소가 잘못되었습니다.
                    </Typography>
                    <Button onClick={() => setErrorModalOpen(false)} variant="contained" sx={{ mt: 2 }}>
                        닫기
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SendEmail;
