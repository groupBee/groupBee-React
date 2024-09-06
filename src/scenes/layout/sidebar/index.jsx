import React, {useEffect} from "react";
import {Avatar, Box, Button, IconButton, Modal, Typography, useTheme} from "@mui/material";
import {useContext, useState} from "react";
import {tokens} from "../../../theme";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import {
    BarChartOutlined,
    CalendarTodayOutlined,
    DashboardOutlined,
    HelpOutlineOutlined,
    MenuOutlined,
    Settings,
    PersonAddAlt1Outlined,
    CreateOutlined,
    FormatListBulletedOutlined,
    SendOutlined,
    CalendarViewMonthOutlined,
    TextsmsOutlined,
    ListAltOutlined,
    DescriptionOutlined, WorkOutlineOutlined, Chat,
} from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import {ToggledContext} from "../../../App";
import OrganizationModal from "../navbar/organizationModal.jsx";
import {useNavigate} from "react-router-dom";

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {toggled, setToggled} = useContext(ToggledContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [orModalOpen, setOrMadalOpen] = useState(false);
    const [infoData, setInfoData] = useState([]);
    const navigate = useNavigate();

    //조직도 모달
    const organizationModalOpen = () => {
        setOrMadalOpen((prev => !prev));
    };

    const organizationModalClose = () => {
        setOrMadalOpen(false);
    };

    useEffect(() => {
        fetch("/api/employee/info")
            .then((res) => res.json())
            .then((data) => setInfoData(data))
            .catch(error => console.error("Error fetching user data in sidebar index: ", error))
        console.log(infoData)
    },[]);

    const handleClick = () => {
        navigate('/'); // 홈 경로로 이동
    };

    return (
        <Sidebar
            backgroundColor="#FFFFFF"
            rootStyles={{
                border: 0,
                height: "100%"
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
                                onClick={handleClick}
                            >
                                <img
                                    style={{height: "55px", borderRadius: "8px", marginTop: "3px"}}
                                    src={logo}
                                    alt="groupBee"
                                />
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
                    {/*/!* 메인페이지 프로필 사진 및 개인정보 띄우기 창 *!/*/}
                    {/*<Avatar*/}
                    {/*    alt="avatar"*/}
                    {/*    src={infoData.profileFile}*/}
                    {/*    sx={{width: "100px", height: "100px"}}*/}
                    {/*/>*/}
                    <Box sx={{textAlign: "center", height: "60px"}}>
                        {/*<Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>*/}
                        {/*    {infoData.name}*/}
                        {/*</Typography>*/}
                        {/*<Typography*/}
                        {/*    variant="h6"*/}
                        {/*    fontWeight="500"*/}
                        {/*    color={colors.yellowAccent[1000]}*/}
                        {/*>*/}
                        {/*    {infoData?.position?.rank}*/}
                        {/*</Typography>*/}
                    </Box>
                </Box>
            )}

            <Box mb={5} pl={collapsed ? undefined : "5%"}>
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                color: "#FFCC1A",
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
                            <Typography variant="h6">
                                {!collapsed ? "전자결재" : " "}
                            </Typography>
                        }
                        icon={<DescriptionOutlined/>}
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

                    <Item
                        title="게시판"
                        path="/board"
                        colors={colors}
                        icon={<ListAltOutlined/>}
                    />
                    <Item
                        title="이메일"
                        path="/email"
                        colors={colors}
                        icon={<TextsmsOutlined/>}
                    />

                    <Item
                        title="출퇴근목록"
                        path="/commutelist"
                        colors={colors}
                        icon={<WorkOutlineOutlined/>}
                    />
                    <Box onClick={() => window.open('https://chat.groupbee.co.kr', '_blank')}>
                        <Item
                            title="채팅"
                            colors={colors}
                            icon={<Chat/>}
                        />
                    </Box>
                    <Box onClick={() => window.open('https://hr.groupbee.co.kr')}>
                    <Item
                        title="HR"
                        colors={colors}
                        icon={<PersonAddAlt1Outlined/>}
                    />
                    </Box>
                </Menu>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // 가로 중앙 정렬
                        alignItems: 'center', // 세로 중앙 정렬
                    }}
                >
                    <Button
                        sx={{
                            width: '80%',
                            height: '50px',
                            fontSize: '15px',
                            textTransform: 'uppercase',
                            letterSpacing: '2.5px',
                            color: '#ffb121',
                            backgroundColor: '#fff',
                            border: '1px solid #ffb121',
                            borderRadius: '4px',
                            transition: 'all 0.3s ease 0s',
                            cursor: 'pointer',
                            minWidth:'30px',
                            marginTop: '20px',
                            '&:hover': {
                                backgroundColor: '#ffb121',
                                boxShadow: '0px 15px 20px rgba(255, 177, 33, 0.4)',
                                color: '#fff',
                                transform: 'translateY(-7px)'
                            }
                        }}
                        onClick={organizationModalOpen}
                    >
                        <b style={{fontSize:'16px',minWidth:'100px'}}>조직도</b>
                    </Button>
                </Box>
            </Box>

            {/*조직도 모달 */}
            <Modal
                open={orModalOpen}
                onClose={organizationModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <OrganizationModal open={orModalOpen} onClose={organizationModalClose}/>
            </Modal>
        </Sidebar>
    );
};

export default SideBar;