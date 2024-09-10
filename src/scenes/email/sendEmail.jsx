import {Box, Button, Chip, TextField, Alert, Modal, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import GroupModal from '../../components/groupModal';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {useLocation} from 'react-router-dom';

const isValidEmail = (email) => {
    // 간단한 이메일 검증 정규식
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const SendEmail = () => {
    const location = useLocation();
    const [to, setTo] = useState([]);  // To 필드를 배열로 변경
    const [cc, setCc] = useState([]);  // CC 필드를 배열로 변경
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState('');
    const [toInput, setToInput] = useState([]);
    const [ccInput, setCcInput] = useState('');
    const [targetField, setTargetField] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);  // 오류 모달 상태 추가
    const [errorMessage, setErrorMessage] = useState('');  // 오류 메시지 상태 추가
    const [textareaHeight, setTextareaHeight] = useState(350);
    const [isHeightAdjusted, setIsHeightAdjusted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [replyText, setReplyText] = useState('');

    //내정보 구하기
    const getInfo = () => {
        axios.get("/api/elecapp/getinfo")
            .then(res => {
                setUserEmail(res.data.email);
            })
    }

    useEffect(() => {
        getInfo();
    }, [])

    useEffect(() => {
        // 쿼리 파라미터에서 이메일 주소, 내용 및 답장 텍스트 가져오기
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email');
        const content = queryParams.get('content');
        const replyText = queryParams.get('replyText');
        const subject = queryParams.get('subject');
        const receivedDate = queryParams.get('receivedDate');
        const to = queryParams.get('to');
        const cc = queryParams.get('cc');
        const from = queryParams.get('from');

        if (email) {
            setToInput(email);
        }
        if (subject) {
            const newSubject = `[Re] ${decodeURIComponent(subject)}`;
            setSubject(newSubject);
        }
        if (content) {
            // 기존 본문 내용과 답장 텍스트 결합
            const combinedBody = replyText
                ? `\n\n${decodeURIComponent(replyText)}
                \n수신일 : ${decodeURIComponent(receivedDate)} 
                \n제목 : ${decodeURIComponent(subject)}
                \n수신 : ${decodeURIComponent(to)}
                \n참조 : ${decodeURIComponent(cc)}
                \n발신 : ${decodeURIComponent(email)}
                
                \n${decodeURIComponent(content)}`
                : decodeURIComponent(content);
            setBody(combinedBody);
        }
    }, [location.search]);

    useEffect(() => {
        if (to.length > 0 && !isHeightAdjusted) {
            setIsHeightAdjusted(true);
        }
    }, [to, isHeightAdjusted]);

    useEffect(() => {
        if (to.length === 0 && isHeightAdjusted) {
            setIsHeightAdjusted(false);
        }
    }, [to, isHeightAdjusted]);


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
            attachment,
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
        // value가 배열이라고 가정하고 처리
        value.forEach(item => {
            let email = item.email;

            // 본인을 수신자로 추가하려는지 확인
            if (email === userEmail) {
                alert('본인은 수신자로 추가할 수 없습니다.');
                return;
            }

            // 'to' 필드 처리
            if (targetField === 'to') {
                if (!to.includes(email) && !cc.includes(email)) {  // 중복 체크: to와 cc 간
                    setTo(prev => [...prev, email]);
                } else {
                    alert('이미 추가된 이메일입니다.');
                }
            }
            // 'cc' 필드 처리
            else if (targetField === 'cc') {
                if (!cc.includes(email) && !to.includes(email)) {  // 중복 체크: cc와 to 간
                    setCc(prev => [...prev, email]);
                } else {
                    alert('이미 추가된 이메일입니다.');
                }
            }
        });
    };


    const handleDelete = (email, field) => {
        if (field === 'to') {
            setTo(prev => prev.filter(e => e !== email));
        } else if (field === 'cc') {
            setCc(prev => prev.filter(e => e !== email));
        }
    };

    const handleAddEmail = (field) => {
        let email = field === 'to' ? toInput.trim() : ccInput.trim();

        if (email === userEmail) {
            alert('본인은 수신자로 추가할 수 없습니다.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('유효하지 않은 이메일 주소입니다.');
            return;
        }

        if (field === 'to' && toInput.trim()) {
            if (!to.includes(toInput) && !cc.includes(toInput)) {  // 중복 체크: to와 cc 간
                setTo(prev => [...prev, toInput]);
                setToInput('');
            } else {
                alert('이미 추가된 이메일입니다.');
            }
        } else if (field === 'cc' && ccInput.trim()) {
            if (!cc.includes(ccInput) && !to.includes(ccInput)) {  // 중복 체크: cc와 to 간
                setCc(prev => [...prev, ccInput]);
                setCcInput('');
            } else {
                alert('이미 추가된 이메일입니다.');
            }
        }
    };

    // react-dropzone을 사용한 드래그 앤 드롭 구현
    const onDrop = (acceptedFiles) => {
        setAttachment(prev => [...prev, ...acceptedFiles]);
    };

    const {getRootProps, getInputProps, open, isDragActive} = useDropzone({
        onDrop,
        noClick: true, // 기본 클릭으로 파일 선택을 하지 않게 함
        noKeyboard: true, // 키보드로 선택 불가능
    });

    // 첨부파일 삭제 기능
    const DeleteAttachment = (fileToRemove) => {
        setAttachment(prev => prev.filter(file => file !== fileToRemove));
    };

    // 전체 첨부파일 삭제 기능
    const DeleteAllAttachment = () => {
        setAttachment([]);
    };

    const FileAttachClick = () => {
        event.preventDefault();
        open();
    };

    return (
        <Box
            sx={{
                m: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                width: '100%', // 반응형을 위한 너비 조정
                padding: '0 10px', // 양쪽에 패딩 추가
            }}
        >
            <Box
                sx={{
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    minHeight: '850px',
                    width: '100%',
                    maxWidth: '1050px',
                    padding: '40px', // 패딩을 줄여서 내용이 잘 보이도록 조정
                    overflow: 'hidden', // 요소가 넘어가면 숨김
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '-10px',
                        marginBottom: '30px',
                        fontSize: '25px',
                    }}
                >
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        fontSize: '25px', marginBottom: '30px', marginTop: '20px'
                    }}><h1>메일 보내기</h1></Box>
                </Box>
                <form onSubmit={handleSendEmail}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <b style={{width: '70px', textAlign: 'center'}}>받는사람</b>
                            <TextField
                                value={toInput}
                                onChange={(e) => setToInput(e.target.value)}
                                placeholder="이메일 추가"
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: '100%', marginLeft: '20px', '& .MuiOutlinedInput-root': {
                                        '& fieldset': {border: 'none'},
                                        borderBottom: '2px solid #dddd', borderRadius: '0',
                                    }
                                }}
                            />
                            <Button
                                style={{
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                    marginRight: '4px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => openModal('to')}>
                                주소록
                            </Button>
                            <Button
                                style={{
                                    color: 'white',
                                    border: '1px solid #ffb121',
                                    backgroundColor: '#ffb121',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => handleAddEmail('to')}>
                                추가
                            </Button>
                        </Box>
                        <Box sx={{
                            width: '700px',
                            marginLeft: '85px',
                            marginTop: '10px',
                            maxHeight: '33px', // 원하는 높이로 조정하세요
                            overflow: 'hidden' // 세로 스크롤을 숨김
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'nowrap', // 세로 스크롤 방지
                                gap: '5px',
                                overflowX: 'auto', // 가로 스크롤 가능
                                overflowY: 'hidden', // 세로 스크롤 방지
                                height: '100%',
                                '&::-webkit-scrollbar': {
                                    height: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#888',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                },
                            }}>
                                {to.map((email, index) => (
                                    <Chip
                                        key={index}
                                        label={email}
                                        onDelete={() => handleDelete(email, 'to')}
                                        sx={{marginBottom: '5px'}}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <b style={{width: '70px', fontSize: '0.9rem'}}>참조</b>
                            <TextField
                                value={ccInput}
                                onChange={(e) => setCcInput(e.target.value)}
                                placeholder="참조 이메일 추가"
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: '100%', marginLeft: '20px', '& .MuiOutlinedInput-root': {
                                        '& fieldset': {border: 'none'},
                                        borderBottom: '2px solid #dddd', borderRadius: '0',
                                    }
                                }}
                            />
                            <Button
                                style={{
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                    marginRight: '4px',
                                    fontWeight: 'bold'
                                }} onClick={() => openModal('cc')}>
                                주소록
                            </Button>
                            <Button
                                style={{
                                    color: 'white',
                                    border: '1px solid #ffb121',
                                    backgroundColor: '#ffb121',
                                    fontWeight: 'bold',
                                }} onClick={() => handleAddEmail('cc')}>
                                추가
                            </Button>
                        </Box>
                        <Box sx={{
                            width: '700px',
                            marginLeft: '85px',
                            marginTop: '10px',
                            maxHeight: '33px', // 원하는 높이로 조정하세요
                            overflow: 'hidden' // 세로 스크롤을 숨김
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'nowrap', // 세로 스크롤 방지
                                gap: '5px',
                                overflowX: 'auto', // 가로 스크롤 가능
                                overflowY: 'hidden', // 세로 스크롤 방지
                                height: '100%',
                                '&::-webkit-scrollbar': {
                                    height: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#888',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                },
                            }}>
                                {cc.map(email => (
                                    <Chip
                                        key={email}
                                        label={email}
                                        onDelete={() => handleDelete(email, 'cc')}
                                        sx={{marginRight: '10px', marginBottom: '5px'}}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <b style={{width: '67px', fontSize: '0.9rem'}}>제목</b>
                            <TextField
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Subject"
                                sx={{
                                    flexGrow: 1, // 남은 공간을 차지하게 함
                                    '& .MuiOutlinedInput-root': {
                                        height: '50px', // 높이 조절
                                        fontSize: '0.85rem', // 글자 크기 조절
                                        '& textarea': {
                                            padding: '8px', // 패딩 조절
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        borderBottom: '2px solid #dddd', // 하단 테두리 조정
                                        borderRadius: '4px', // 둥근 모서리 (선택 사항)
                                    },
                                }}
                            />
                        </Box>


                        <Box sx={{marginTop: '20px'}}>
                    <textarea
                        style={{
                            width: '100%',
                            height: `${textareaHeight}px`,
                            marginTop: '10px',
                            borderColor: '#dddd',
                            resize: 'none',
                            outline: 'none',
                            padding: '10px'
                        }}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Your message"
                    />
                        </Box>

                    </div>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px'}}>
                        <button
                            type="submit"
                            style={{
                                marginTop: '5px',
                                backgroundColor: '#fd7200',
                                border: '1px solid #fd7200',
                                padding: '6px 20px',
                                borderRadius: '4px',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            전송
                        </button>
                    </Box>
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
                        <Button onClick={() => setErrorModalOpen(false)} variant="contained" sx={{mt: 2}}>
                            닫기
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default SendEmail;
