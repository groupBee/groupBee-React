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
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import {
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
    const { logout, id, isAdmin } = useStore();
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

            <Box>
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
                            >   <Box>id: {id}</Box>
                                <Box>{isAdmin ? "관리자" : "관리자(x)"}</Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => alert("Profile clicked")}
                                >
                                    Profile
                                </Button>
                                <Button
                                    variant="contained"
                                    color="info"
                                    fullWidth
                                    sx={{ mt: 1 }}
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
