import React from "react";
import {Avatar, Box, IconButton, Typography, useTheme} from "@mui/material";
import {useContext, useState} from "react";
import {tokens} from "../../../theme";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import {
    BarChartOutlined,
    CalendarTodayOutlined,
    ContactsOutlined,
    DashboardOutlined,
    DonutLargeOutlined,
    HelpOutlineOutlined,
    MapOutlined,
    MenuOutlined,
    PeopleAltOutlined,
    PersonOutlined,
    ReceiptOutlined,
    TimelineOutlined,
    WavesOutlined,
    Settings,
    PersonAddAlt1Outlined,
    CreateOutlined,
    FormatListBulletedOutlined,
    SendOutlined,
    CalendarViewMonthOutlined,
    TextsmsOutlined,
} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import {ToggledContext} from "../../../App";

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {toggled, setToggled} = useContext(ToggledContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Sidebar
            backgroundColor={colors.primary[400]}
            rootStyles={{
                border: 0,
                height: "100%",
            }}
            collapsed={collapsed}
            onBackdropClick={() => setToggled(false)}
            toggled={toggled}
            breakPoint="md"
        >
            <Menu
                menuItemStyles={{
                    button: {":hover": {background: "transparent"}},
                }}
            >
                <MenuItem
                    rootStyles={{
                        margin: "10px 0 20px 0",
                        color: colors.gray[100],
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {!collapsed && (
                            <Box
                                display="flex"
                                alignItems="center"
                                gap="12px"
                                sx={{transition: ".3s ease"}}
                            >
                                <img
                                    style={{width: "30px", height: "30px", borderRadius: "8px"}}
                                    src={logo}
                                    alt="Argon"
                                />
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                    color={colors.greenAccent[500]}
                                >
                                    Argon
                                </Typography>
                            </Box>
                        )}
                        <IconButton onClick={() => setCollapsed(!collapsed)}>
                            <MenuOutlined/>
                        </IconButton>
                    </Box>
                </MenuItem>
            </Menu>
            {!collapsed && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        mb: "25px",
                    }}
                >
                    {/* 메인페이지 프로필 사진 및 개인정보 띄우기 창 */}
                    <Avatar
                        alt="avatar"
                        src={avatar}
                        sx={{width: "100px", height: "100px"}}
                    />
                    <Box sx={{textAlign: "center"}}>
                        <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
                            박 보 민
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight="500"
                            color={colors.greenAccent[500]}
                        >
                            VP Fancy Admin
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box mb={5} pl={collapsed ? undefined : "5%"}>
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#868dfb",
                                background: "transparent",
                                transition: ".4s ease",
                            },
                        },
                        subMenuContent: ({level}) => ({
                            backgroundColor: "transparent",
                        }),
                    }}
                >
                    <Item
                        title="메인페이지"
                        path="/"
                        colors={colors}
                        icon={<DashboardOutlined/>}
                    />

                    <SubMenu
                        label={
                            <Typography variant="h6" color={colors.gray[300]}>
                                {!collapsed ? "전자결재" : " "}
                            </Typography>
                        }
                        icon={<PeopleAltOutlined/>}
                    >
                        <Item
                            title="결재작성"
                            path="/write"
                            colors={colors}
                            icon={<CreateOutlined/>}
                        />
                        <Item
                            title="결재현황"
                            path="/list"
                            colors={colors}
                            icon={<FormatListBulletedOutlined/>}
                        />
                        <Item
                            title="발신목록"
                            path="/send"
                            colors={colors}
                            icon={<SendOutlined/>}
                        />
                    </SubMenu>

                    <SubMenu
                        label={
                            <Typography variant="h6" color={colors.gray[300]}>
                                {!collapsed ? "일정" : " "}
                            </Typography>
                        }
                        icon={<CalendarViewMonthOutlined/>}
                    >
                        <Item
                            title="캘린더"
                            path="/calendar"
                            colors={colors}
                            icon={<CalendarTodayOutlined/>}
                        />
                        <Item
                            title="예약"
                            path="/book"
                            colors={colors}
                            icon={<HelpOutlineOutlined/>}
                        />
                    </SubMenu>

                    <SubMenu
                        label={
                            <Typography variant="h6" color={colors.gray[300]}>
                                {!collapsed ? "게시판" : " "}
                            </Typography>
                        }
                        icon={<BarChartOutlined/>}
                    >
                        <Item
                            title="공지사항"
                            path="/notice"
                            colors={colors}
                            icon={<BarChartOutlined/>}
                        />
                        <Item
                            title="사원 게시판"
                            path="/board"
                            colors={colors}
                            icon={<DonutLargeOutlined/>}
                        />
                    </SubMenu>
                    <SubMenu
                        label={
                            <Typography variant="h6" color={colors.gray[300]}>
                                {!collapsed ? "설정" : " "}
                            </Typography>
                        }
                        icon={<Settings/>}
                    >
                        <Item
                            title="HR"
                            path="/hr"
                            colors={colors}
                            icon={<PersonAddAlt1Outlined/>}
                        />
                        <Item
                            title="마이페이지"
                            path="/mypage"
                            colors={colors}
                            icon={<BarChartOutlined/>}
                        />
                    </SubMenu>
                    <SubMenu
                        label={
                            <Typography variant="h6" color={colors.gray[300]}>
                                {!collapsed ? "채팅" : " "}
                            </Typography>
                        }
                        icon={<TextsmsOutlined/>}
                    >
                        <Item
                            title="채팅"
                            path="/chat"
                            colors={colors}
                            icon={<TextsmsOutlined/>}
                        />
                    </SubMenu>
                </Menu>
            </Box>
        </Sidebar>
    );
};

export default SideBar;