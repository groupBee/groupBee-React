import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useRef, useEffect, useState } from 'react';
import { MoreHoriz } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import "../calendar/calendar.css";

function Dashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [filteredData, setFilteredData] = useState([]);
    const [memberId, setMemberId] = useState("");
    const [status, setStatus] = useState("all"); // 기본 상태는 'all'
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const calendarRef = useRef(null); // 캘린더 참조

    const handleBoard = () => {
        navigate("/board");
    };

    const handleCalendar = () => {
        navigate("/calendar");
    };

    const handleEmailList = () => {
        navigate("/email", { state: { view: "list" } });
    };

    const handleEmailWrite = () => {
        navigate("/email", { state: { view: "send" } });
    };

    const handleList = () => {
        navigate("/list");
    };

    const handleBook = () => {
        navigate("/book/booklist");
    };

    const handleCarBook = () => {
        navigate("/book/carbook");
    };

    // 데이터 가져오기
    const getinfo = async () => {
        try {
            const res = await axios.get("/api/elecapp/getinfo");
            const fetchedMemberId = res.data.name;
            setMemberId(fetchedMemberId);
            getList(fetchedMemberId);
        } catch (err) {
            console.error("Error fetching info:", err);
        }
    };

    const getList = async (fetchedMemberId) => {
        if (!fetchedMemberId) return;
        try {
            const res = await axios.get(`/api/elecapp/status?memberId=${fetchedMemberId}&status=${status}`);
            setFilteredData(res.data);
        } catch (err) {
            console.error("Error fetching list:", err);
        }
    };

    // 캘린더 데이터 가져오기
    const fetchData = async () => {
        try {
            const calendarResponse = await fetch("/api/calendar/list");
            // HTTP 상태 코드를 확인하여 200이 아닌 경우 오류 처리
            if (!calendarResponse.ok) {
                if (calendarResponse.status === 404) {
                    console.error("404: 서버에서 데이터를 찾을 수 없습니다.");
                } else if (calendarResponse.status === 500) {
                    console.error("500: 서버 오류가 발생했습니다.");
                } else if (calendarResponse.status === 502) {
                    console.error("502: Gateway 오류가 발생했습니다.");
                } else {
                    console.error(`${calendarResponse.status}: 알 수 없는 오류가 발생했습니다.`);
                }
                // FullCalendar 초기화
                const calendarApi = calendarRef.current.getApi();
                calendarApi.removeAllEvents();
                return;
            }
            const calendarData = await calendarResponse.json();

            const eventsData = calendarData.map(event => ({
                id: event.id,
                title: event.title,
                content: event.content,
                start: event.startDay,
                end: event.endDay,
                backgroundColor: '#ffc107',     // 이벤트 배경색
                borderColor: '#ffc107',         // 이벤트 테두리색
                textColor: '#111111',
            }));
            setEvents(eventsData);
            console.log(eventsData);
        } catch (e) {
            console.log("받아올 데이터가 없습니다.");
            // 오류 발생 시 FullCalendar 초기화
            const calendarApi = calendarRef.current.getApi();
            calendarApi.removeAllEvents();  // 모든 이벤트 제거
        }
    };

    useEffect(() => {
        if (memberId) {
            getList(memberId);
        }
    }, [status, memberId]);

    useEffect(() => {
        getinfo();
        fetchData(); // 캘린더 데이터 가져오기
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="flex-end" mb="20px">
                <Button style={{ marginRight: '10px' }} onClick={handleCarBook}>예약하기</Button>
                <Button onClick={handleEmailWrite}>메일보내기</Button>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns={
                    isXlDevices
                        ? "repeat(12, 1fr)"
                        : isMdDevices
                            ? "repeat(6, 1fr)"
                            : "repeat(3, 1fr)"
                }
                gridAutoRows="140px"
                gap="20px"
            >
                {/* 공지사항 */}
                <Box
                    gridColumn={
                        isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
                    }
                    gridRow="span 3"
                    bgcolor={colors.primary[400]}
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            공지사항
                            <IconButton onClick={handleBoard}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>

                {/* 캘린더 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    bgcolor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    height="100%" // Ensure the Box takes up available height
                >
                    <Box
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        p="15px"
                        flexShrink={0}
                        position="sticky"
                        top="0"
                        bgcolor={colors.primary[400]}
                    >
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            캘린더
                            <IconButton onClick={handleCalendar}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" flexGrow={1} overflow="auto">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
                            headerToolbar={false}  // 기본 툴바 숨기기
                            customButtons={{
                                customPrev: {
                                    text: '◀',
                                    click: () => calendarRef.current.getApi().prev()
                                },
                                customNext: {
                                    text: '▶',
                                    click: () => calendarRef.current.getApi().next()
                                }
                            }}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={(info) => {
                                alert(`이벤트: ${info.event.title}`);
                            }}
                            locale='ko'
                            height="auto"
                            headerToolbar={{
                                left: 'customPrev',
                                center: 'title',
                                right: 'customNext'
                            }}
                        />
                    </Box>
                </Box>

                {/* 근테관리 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            근테관리
                            <IconButton onClick={handleEmailList}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" maxHeight="200px" overflow="auto">
                    </Box>
                </Box>

                {/* 결제현황 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="hidden" // 스크롤을 추가할 박스 아래쪽
                    display="flex"
                    flexDirection="column"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px" flexShrink={0}>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            결제현황
                            <IconButton onClick={handleList}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" flexGrow={1} overflow="auto">
                        {/* 결제 상태 필터 버튼 */}
                        <Box display="flex" justifyContent="space-around" mb="10px">
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("rejected")}>반려</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ready")}>결재 대기</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ing")}>결재 중</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("done")}>결제 완료</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("all")}>모두 보기</Button>
                        </Box>

                        {/* 필터링된 데이터 표시 */}
                        {filteredData.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                <tr style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>종류</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>제목</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>작성자</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>부서</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>상태</td>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{width:'15%', textAlign:'center'}}>
                                            {item.appDocType === 0 ? '품의서' :
                                                item.appDocType === 1 ? '휴가신청서' :
                                                    item.appDocType === 2 ? '지출보고서' : ''}
                                        </td>
                                        <td style={{width:'37%'}}>{item.additionalFields.title || '제목 없음'}</td>
                                        <td style={{width:'15%', textAlign:'center'}}>{item.writer}</td>
                                        <td style={{width:'16%', textAlign:'center'}}>{item.department}</td>
                                        <td style={{width:'17%', textAlign:'center'}}>{item.additionalFields.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <Typography variant="body1" color="textSecondary">데이터가 없습니다.</Typography>
                        )}
                    </Box>
                </Box>

                {/* 예약현황 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            예약현황
                            <IconButton onClick={handleBook}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" maxHeight="200px" overflow="auto">
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
