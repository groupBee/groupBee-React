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
                                        p: 2,
                                        zIndex: 100,
                                        bgcolor: '#primary[400]',
                                        width: '900px',
                                        height: '300px'
                                    }}
                                >
                                    <Typography variant="h4" padding="5px">내정보</Typography>
                                    <Box borderBottom="1px solid #e0e0e0" marginTop="5px" />

                                    {/* 메인 레이아웃 */}
                                    {infoData && (
                                    <Box sx={{ display: 'flex', marginTop: '15px' }}>
                                        {/* 왼쪽 사진 */}
                                        <Box sx={{  display: 'flex'}}>
                                            <img
                                                src={infoData.profileFile}
                                                alt="Profile"
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    border: '1px solid black',
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        </Box>

                                        {/* 오른쪽 정보들 */}
                                        <Box sx={{ marginLeft: '35px' }}>
                                            <Table>
                                                <TableBody>
                                                    {/* 첫 번째 줄: 이름과 상태 */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: 'none' }}>
                                                            이름
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem', borderBottom: 'none' }}>{infoData.name}</TableCell>
                                                        <TableCell sx={{
                                                            fontSize: '1rem',
                                                            borderBottom: 'none',
                                                            fontWeight: 'bold'

                                                        }}>
                                                            <span style={{ color: '#ff5e16',backgroundColor: '#ffede0', padding:'4px', borderRadius:'5px' }}>
                                                                {infoData.isAdmin ? '관리자' : ''}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* 두 번째 줄: 정보 4개 */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            직책
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.position.rank}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            부서
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.department.departmentName}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            이메일
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.email}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            전화번호
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.phoneNumber}</TableCell>
                                                    </TableRow>

                                                    {/* 세 번째 줄: 추가 정보 4개 */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            입사일
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.firstDay}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            사번
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.idNumber}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            주소
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.address}</TableCell>
                                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            내선전화
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1rem' }}>{infoData.extensionCall}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                }}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#2c3d4f',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#364d63',
                                                        }
                                                    }}
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#2c3d4f',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#364d63',
                                                        }
                                                    }}
                                                    onClick={handlePassModalOpen}
                                                >
                                                    비밀번호 변경
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#2c3d4f',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#364d63',
                                                        }
                                                    }}
                                                    onClick={organizationModalOpen}
                                                >
                                                    조직도
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
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
