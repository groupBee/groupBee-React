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
    Tab,
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
//비밀번호 변경 모달창 css
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
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
        //현재 비밀번호 확인
        const checkOriginalPass = () => {
            const data = {
                old: originalPass,
                new: newPass1
              };
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            axios("/employee/auth/changepasswd", formData)
                .then(res => {
                    console.log(res.data);
                })
        }
        // 드롭다운 상태 관리
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [passModalOpen, setPassMadalOpen] = useState(false);

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


        // 타이머 포맷팅 함수
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        const handleRefresh = async () => {
            await initializeState(); // 상태를 초기화합니다.
        };

        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                        sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
                        onClick={() => setToggled(!toggled)}
                    >
                        <MenuOutlined />
                    </IconButton>
                    <Box
                        display="flex"
                        alignItems="center"
                        bgcolor={colors.primary[400]}
                        borderRadius="3px"
                        sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
                    >
                        <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                </Box>

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
                    <IconButton>
                        <SettingsOutlined />
                    </IconButton>
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
                                        zIndex: 1,
                                        bgcolor: colors.primary[400],
                                    }}
                                >
                                    {isAdmin ? <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#fdaf1a', // 원하는 배경색
                                            color: '#fff', // 텍스트 색상

                                            '&:hover': {
                                                backgroundColor: '#ffb41d', // 호버 시 배경색
                                            }
                                        }}

                                        fullWidth
                                        onClick={() => navigate('/admin')}
                                    >
                                        관리자
                                    </Button> : ""}

                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#2c3d4f', // 원하는 배경색
                                            color: '#fff', // 텍스트 색상
                                            mt: 1,
                                            '&:hover': {
                                                backgroundColor: '#364d63', // 호버 시 배경색
                                            }
                                        }}
                                        fullWidth
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#2c3d4f', // 원하는 배경색
                                            color: '#fff', // 텍스트 색상
                                            mt: 1,
                                            '&:hover': {
                                                backgroundColor: '#364d63', // 호버 시 배경색
                                            }
                                        }}
                                        fullWidth
                                        onClick={handlePassModalOpen}
                                    >
                                        비밀번호 변경
                                    </Button>
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
                                        <b color="red">{passMessage}</b>
                                    </Typography>
                                </Box>
                            </Modal>
                        </Box>
                    </ClickAwayListener>
                </Box>
            </Box>
        );
    };

export default Navbar;
