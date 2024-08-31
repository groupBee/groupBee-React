import React, { useState, useContext, useEffect } from "react";
import {
    Box,
    IconButton,
    InputBase,
    useMediaQuery,
    useTheme,
    Button,
    Paper,
    ClickAwayListener,
    Typography,
    Modal,
    OutlinedInput,
    Tabs,
    Tab, TableBody, TableRow, TableCell, TableFooter,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import {
    AccessTimeOutlined,
    DarkModeOutlined,
    LightModeOutlined,
    MenuOutlined,
    NotificationsOutlined,
    PersonOutlined,
    SearchOutlined,
    SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import useStore from "../../../store";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {Header} from "../../../components/index.jsx";
import {Table} from "react-bootstrap";
import OrganizationModal from "./organizationModal.jsx";
//비밀번호 변경 모달창 css
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Navbar = () => {
    const { logout, id, isAdmin, timer, initializeState } = useStore();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const { toggled, setToggled } = useContext(ToggledContext);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colors = tokens(theme.palette.mode);
    const [originalPass, setOriginalPass] = useState('');
    const [newPass1, setNewPass1] = useState('');
    const [newPass2, setNewPass2] = useState('');
    const [passMessage, setPassMassage] = useState('');
    const navigate = useNavigate();
    const [infoData, setInfoData] = useState([]);


    //비밀번호 조건 확인
        const matchpass = () => {
            if (newPass1 === newPass2) {
                if (newPass1.length >= 8) {
                    checkOriginalPass();
                } else {
                    setPassMassage('비밀번호를 8자 이상으로 입력해주세요')
                    setNewPass1('');
                    setNewPass2('');
                }
            } else {
                setPassMassage('입력한 비밀번호가 일치하지 않습니다')
                setNewPass1('');
                setNewPass2('');
            }
        }
     // 현재 비밀번호 확인
const checkOriginalPass = () => {

    const formData = new FormData();
    
    const data = {
        old: originalPass,
        new: newPass1
    };

    // JSON.stringify로 데이터를 문자열로 변환한 후 Blob으로 감싸서 FormData에 추가
    formData.append("data", new Blob([JSON.stringify(data)], {type: "application/json"}));

    axios({
        url: '/api/employee/auth/changepasswd',
        data: formData,
        method:'put'
        // ,
        // headers: {
        //     'Content-Type': 'multipart/form-data'  // multipart/form-data를 명시적으로 설정
        // }
    })
    .then(res => {
        alert(res.data.message);  // 서버에서 보낸 메시지를 표시
    })
    .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);  // 에러 핸들링
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    });
};

    
    
        // 드롭다운 상태 관리
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [passModalOpen, setPassMadalOpen] = useState(false);
        const [orModalOpen, setOrMadalOpen] = useState(false);

        const handleLogout = () => {
            logout(); // 로그아웃 함수 실행
        };

        const handleDropdownToggle = () => {
            setIsDropdownOpen((prev) => !prev);
        };

        const handleDropdownClose = () => {
            setIsDropdownOpen(false);
        };

        //비밀번호 변경 모달
        const handlePassModalOpen = () => {
            setPassMadalOpen((prev => !prev));
        };
        const handlePassModalClose = () => {
            setPassMadalOpen(false);
        };

        //조직도 모달
         const organizationModalOpen = () => {
            setOrMadalOpen((prev => !prev));
        };
        const organizationModalClose = () => {
            setOrMadalOpen(false);
        };


        // 타이머 포맷팅 함수
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        const handleRefresh = async () => {
            await initializeState(); // 상태를 초기화합니다.
        };
         const handleIconClick = () => {
             navigate('/admin'); // navigate를 사용하여 경로 변경
        };

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

        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
            >
                <Box></Box>

                <Box display="flex" alignItems="center" >
                    {/* 타이머 표시 */}
                    <Box display="flex" alignItems="center" justifyContent="space-between"
                        onClick={handleRefresh}
                        sx={{
                            width: '95px',
                            backgroundColor: '#ff960c',
                            mr: 1,
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}>
                        <Typography
                            variant="h1"
                            sx={{
                                color: timer <= 300 ? 'red' : 'white', // 텍스트 색상
                                fontWeight: 'bold',
                                fontSize: '1.1rem', // 폰트 크기 조정
                                marginTop: '3px',
                                marginLeft: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            {formatTime(timer)}
                        </Typography>
                        <IconButton>
                            <AccessTimeOutlined
                                sx={{
                                    color: timer <= 300 ? 'red' : 'white',
                                    transition: 'background-color 0.3s ease',
                                }} />
                        </IconButton>
                    </Box>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? (
                            <LightModeOutlined />
                        ) : (
                            <DarkModeOutlined />
                        )}
                    </IconButton>
                    <IconButton>
                        <NotificationsOutlined />
                    </IconButton>
                    {isAdmin ?
                    <IconButton>
                        <SettingsOutlined onClick={handleIconClick}/>
                    </IconButton>: ""}
                    {/* Person Icon with Dropdown */}
                    <ClickAwayListener onClickAway={handleDropdownClose}>
                        <Box display="inline-block" position="relative">
                            <IconButton onClick={handleDropdownToggle}>
                                <PersonOutlined />
                            </IconButton>

                            {isDropdownOpen && (
                                <Paper
                                    elevation={3}
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        mt: 1,
                                        zIndex: 100,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', // 투명한 배경색
                                        width: '350px',
                                        height: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        borderRadius: '12px', // 모서리를 둥글게
                                        backdropFilter: 'blur(25px)', // 흐림 효과
                                        border: '1px solid rgba(255, 255, 255, 0.3)', // 테두리 효과
                                    }}
                                >
                                    {infoData && (
                                        <>
                                            <Box
                                                sx={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    bgcolor: '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mt: 7,
                                                    overflow: 'hidden', // 이미지가 박스 밖으로 나가지 않도록 설정
                                                    border: '0.7px solid #2E2E2E'
                                                }}
                                            >
                                                <img
                                                    src={infoData.profileFile}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover' // 이미지를 박스 크기에 맞추고 비율 유지
                                                    }}
                                                />
                                            </Box>

                                            <Box textAlign="center" mb={2} mt={2}>
                                                <Typography sx={{ fontSize: '18px' }}>
                                                    {infoData.name}
                                                    {infoData.isAdmin && (
                                                        <span style={{
                                                            marginLeft: '4px', // 이름과 어드민 표시 사이에 간격을 둠
                                                            fontSize: '18px', // 어드민 텍스트의 크기 조정
                                                            color: '#ff5722', // 어드민 텍스트 색상 (예: 오렌지색)
                                                            fontWeight: 'bold' // 어드민 텍스트 굵기
                                                        }}>(관리자)</span>
                                                    )}
                                                </Typography>
                                                <Typography sx={{ fontSize: '15px' }} color="textSecondary">{infoData.position.rank}/{infoData.department.departmentName}</Typography>
                                            </Box>

                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                gap={1}
                                                width="100%"
                                            >
                                                <Button variant="contained" color="primary" sx={{backgroundColor:'#ffb121', boxShadow:'0'}} onClick={handleLogout}>로그아웃</Button>
                                                <Button variant="outlined" color="primary" onClick={handlePassModalOpen}>비밀번호변경</Button>
                                                <Button variant="outlined" color="primary" onClick={organizationModalOpen}>조직도</Button>
                                            </Box>

                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    bgcolor: '#f9f9f9', // 배경색을 밝은 회색으로 변경하여 가독성 향상
                                                    flexGrow: 1,
                                                    mt: 2,
                                                    p: 3, // padding을 추가하여 내부 여백을 늘립니다.
                                                    borderRadius: '8px', // 모서리를 둥글게
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 추가로 카드 느낌을 줍니다.
                                                }}
                                            >
                                                <Box padding="10px" ml={4}>
                                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' , fontSize: '15px'}}>
                                                        이메일: <span style={{ fontWeight: 'normal' }}>{infoData.email}</span>
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' , fontSize: '15px'}}>
                                                        전화번호: <span style={{ fontWeight: 'normal' }}>{infoData.phoneNumber}</span>
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' , fontSize: '15px'}}>
                                                        내선번호: <span style={{ fontWeight: 'normal' }}>{infoData.extensionCall}</span>
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' , fontSize: '15px'}}>
                                                        주소: <span style={{ fontWeight: 'normal' }}>{infoData.address}</span>
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' , fontSize: '15px'}}>
                                                        사원번호: <span style={{ fontWeight: 'normal' }}>{infoData.idNumber}</span>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Paper>
                            )}


                            {/* 비밀번호 변경 모달 */}

                            <Modal
                                open={passModalOpen}
                                onClose={handlePassModalClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <h2>비밀번호 변경</h2>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        기본 비밀번호 : <OutlinedInput type="text" value={originalPass} onChange={(e) => setOriginalPass(e.target.value)} /><br />
                                        새로운 비밀번호 : <OutlinedInput type="password" value={newPass1} onChange={(e) => setNewPass1(e.target.value)} /><br />
                                        비밀번호 확인: <OutlinedInput type="password" value={newPass2} onChange={(e) => setNewPass2(e.target.value)} /><br />
                                        <Button variant="contained" color="warning" size="small" onClick={matchpass}>변경</Button>
                                        <b style={{ color:'red'}}>{passMessage}</b>
                                    </Typography>
                                </Box>
                            </Modal>

                            {/*조직도 모달 */}
                            <Modal
                                open={orModalOpen}
                                onClose={organizationModalClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                              <OrganizationModal/>
                            </Modal>
                        </Box>
                    </ClickAwayListener>
                </Box>
            </Box>
        );
    };

export default Navbar;
