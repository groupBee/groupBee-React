import React, { useState, useContext } from "react";
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

const Navbar = () => {
    const { logout, id, isAdmin, timer, initializeState } = useStore();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const { toggled, setToggled } = useContext(ToggledContext);
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const colors = tokens(theme.palette.mode);

    // 드롭다운 상태 관리
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout(); // 로그아웃 함수 실행
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleDropdownClose = () => {
        setIsDropdownOpen(false);
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
                    backgroundColor:'#ff960c',
                    mr: 1,
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                <Typography
                    variant="h1"
                    sx={{
                        color: 'white', // 텍스트 색상
                        fontWeight: 'bold',
                        fontSize: '1.1rem', // 폰트 크기 조정
                        marginTop: '3px',
                        marginLeft: '12px',
                        cursor: 'pointer'
                    }}
                >
                    {formatTime(timer)}
                </Typography>
                <IconButton>
                    <AccessTimeOutlined
                        sx={{
                            color: 'white', // 텍스트 색상
                        }}/>
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
                                {isAdmin ?    <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#fdaf1a', // 원하는 배경색
                                        color: '#fff', // 텍스트 색상
                                        '&:hover': {
                                            backgroundColor: '#ffb41d', // 호버 시 배경색
                                        }
                                    }}

                                    fullWidth
                                    onClick={() => alert("Profile clicked")}
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
                            </Paper>
                        )}
                    </Box>
                </ClickAwayListener>
            </Box>
        </Box>
    );
};

export default Navbar;
