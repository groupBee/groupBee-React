import { Box, Button, Chip, TextField, Alert, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import GroupModal from '../../components/groupModal';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useLocation } from 'react-router-dom';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail,setUserEmail]=useState("");

    //내정보 구하기
    const getInfo =()=>{
        axios.get("/api/elecapp/getinfo")
        .then(res => {
           setUserEmail(res.data.email);
        })
    }

    useEffect(()=>{
        getInfo();
    },[])

    useEffect(() => {
        // 쿼리 파라미터에서 이메일 주소 가져오기
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email');
        if (email) {
            setToInput(email);
        }
    }, [location.search]);

    // 참조인 및 받는 사람 추가 및 삭제에 따른 텍스트 영역 크기 조절 로직
    useEffect(() => {
        const totalRecipients = to.length + cc.length;
        // 기본 크기 설정 및 추가된 이메일 수에 따라 높이 조정
        setTextareaHeight(350 - totalRecipients * 40);
    }, [to, cc]);

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
        if (value.email === userEmail) {
            alert('본인은 수신자로 추가할 수 없습니다.');
            return;
        }
    
        if (targetField === 'to') {
            if (!to.includes(value.email) && !cc.includes(value.email)) {  // 중복 체크: to와 cc 간
                setTo(prev => [...prev, value.email]);
            } else {
                alert('이미 추가된 이메일입니다.');
            }
        } else if (targetField === 'cc') {
            if (!cc.includes(value.email) && !to.includes(value.email)) {  // 중복 체크: cc와 to 간
                setCc(prev => [...prev, value.email]);
            } else {
                alert('이미 추가된 이메일입니다.');
            }
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

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
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
        <div>
            <form onSubmit={handleSendEmail}>
                <hr />
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    padding: '10px 30px'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
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
                        <Button variant='contained' color='warning' onClick={() => openModal('to')}>
                            주소록
                        </Button>
                        <Button variant='contained' color='primary' onClick={() => handleAddEmail('to')}>
                            추가
                        </Button>
                    </Box>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '5px', width: '700px',marginLeft:'85px'}}>
                        {to.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDelete(email, 'to')}
                                sx={{marginBottom: '5px'}}
                            />
                        ))}
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <b style={{width: '70px', textAlign: 'center'}}>참조</b>
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
                        <Button variant='contained' color='warning' onClick={() => openModal('cc')}>
                            주소록
                        </Button>
                        <Button variant='contained' color='primary' onClick={() => handleAddEmail('cc')}>
                            추가
                        </Button>
                    </Box>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '5px', width: '700px',marginLeft:'85px'}}>
                        {cc.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDelete(email, 'cc')}
                                sx={{marginBottom: '5px'}}
                            />
                        ))}
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <b style={{width: '65px', textAlign: 'center'}}>제목</b>
                        <TextField
                            fullWidth
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject"
                            sx={{
                                width: '100%', marginLeft: '20px', '& .MuiOutlinedInput-root': {
                                    '& fieldset': {border: 'none'},
                                    borderBottom: '2px solid #dddd', borderRadius: '0',
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <b style={{width: '65px', textAlign: 'center'}}>첨부파일</b>
                        <button
                            onClick={FileAttachClick}  // 파일첨부 버튼 클릭 시 파일 선택 창 열기
                            style={{ marginLeft: '20px', border:'1px solid #dddd', backgroundColor: 'transparent', borderRadius:'4px',padding: '3px 6px'}}
                        >
                            파일첨부하기
                        </button>
                        {attachment.length > 0 && (
                            <button
                                onClick={DeleteAllAttachment}
                                style={{ marginLeft: '10px', border:'1px solid #dddd', backgroundColor: 'transparent', borderRadius:'4px',padding: '3px 6px'}}
                            >
                                전체삭제
                            </button>
                        )}
                    </Box>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #dddddd',
                            borderRadius: '4px',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                            marginBottom: '20px',
                        }}
                    >
                        <input {...getInputProps()} />
                        {attachment.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
                                {attachment.map((file, index) => (
                                    <Chip
                                        key={index}
                                        label={file.name}
                                        onDelete={() => DeleteAttachment(file)}
                                        sx={{
                                            maxWidth: '200px', // 파일명이 너무 길 경우 잘리게 함
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden'
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <>
                            <UploadFileIcon style={{color:'gray', marginBottom:'5px'}}/>
                            <p style={{color:'gray'}}>파일을 여기에 드래그하여 파일을 선택하세요.</p>
                            </>
                        )}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <b style={{width: '62px', textAlign: 'center'}}>내용</b>
                    </Box>
                    <Box>
                    <textarea
                        style={{width: '100%', height: `${textareaHeight}px`,marginTop:'10px', borderColor:'#dddd',resize: 'none',outline: 'none', padding:'10px'}}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Your message"
                    />
                    </Box>
                </div>
                 <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <button type="submit"
                                style={{
                                    marginTop: '5px', backgroundColor: 'transparent', border: '1px solid black'
                                    , padding: '6px 20px', borderRadius: '4px'
                                }}>
                            보내기
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
                    <Button onClick={() => setErrorModalOpen(false)} variant="contained" sx={{ mt: 2 }}>
                        닫기
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SendEmail;
