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
import "./dashboardcss.css";
import "./clock.css";
import Weather from "./weather.jsx";
import DashboardBook from "./dashboardBook.jsx";

function Dashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [filteredData, setFilteredData] = useState([]);
    const [memberId, setMemberId] = useState("");
    const [status, setStatus] = useState("all");
    const [events, setEvents] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTime, setCurrentTime] = useState("");
    const [currentDay, setCurrentDay] = useState("");
    const [midday, setMidday] = useState("");
    const navigate = useNavigate();
    const calendarRef = useRef(null);

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
            if (!calendarResponse.ok) {
                console.error(`${calendarResponse.status}: ${calendarResponse.statusText}`);
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
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                textColor: '#111111',
            }));
            setEvents(eventsData);
        } catch (e) {
            console.log("받아올 데이터가 없습니다.");
            const calendarApi = calendarRef.current.getApi();
            calendarApi.removeAllEvents();
        }
    };

    // 공지사항 데이터 가져오기
    const fetchBoardList = async () => {
        try {
            const res = await axios.get('/api/board/list');
            const importantPosts = res.data.filter(post => post.board.mustMustRead);
            const regularPosts = res.data.filter(post => !post.board.mustMustRead);

            // 중요 게시글을 상단에, 일반 게시글을 그 아래에 표시
            const combinedPosts = [
                ...importantPosts,
                ...regularPosts
            ];

            // 상위 8개 항목을 선택
            const displayedPosts = combinedPosts.slice(0, 8);

            // 상태 업데이트
            setBoardList(displayedPosts);
            setTotalPages(Math.ceil(combinedPosts.length / 8)); // 페이지 수 계산
        } catch (error) {
            console.error('Error fetching board list:', error);
        }
    };

    const handleTitleClick = (id) => {
        navigate(`/board/list/${id}/${currentPage}`); // 클릭한 게시글의 상세 페이지로 이동
    };

    useEffect(() => {
        if (memberId) {
            getList(memberId);
        }
    }, [status, memberId]);

    useEffect(() => {
        getinfo();
        fetchData();
        fetchBoardList(); // 공지사항 데이터 가져오기
    }, [currentPage]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hour = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const day = now.getDay();

            // 오전/오후 설정
            const middayStr = hour >= 12 ? "PM" : "AM";
            setMidday(middayStr);

            // 12시간 형식으로 변경
            hour = hour % 12 || 12;

            // 시간 형식 지정
            setCurrentTime(
                `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );

            // 요일 설정
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            setCurrentDay(dayNames[day]);
        };

        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    //attendance 체크인
    const checkin = async () => {
        try {
            // 현재 로컬 시간을 가져옵니다.
            const localDateTime = new Date().toISOString(); // ISO 8601 형식으로 변환

            // 서버에 POST 요청을 보냅니다.
            const res = await axios.post("/api/attendance/checkin", {
                checkIn: localDateTime
            });

            // 응답 처리
            console.log("Check-in successful:", res.data);
            alert('출근')
        } catch (err) {
            console.error("Error checking in:", err);
        }
    };

    //attendance 체크아웃
    const checkout = async () => {
        try {
            const localDateTime = new Date().toISOString();

            const res = await axios.post("/api/attendance/checkout", {
                checkOut: localDateTime
            });
            alert('퇴근')
        } catch (err) {
            console.error("Error fetching info:", err);
        }
    };




    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" mb="10px" alignItems="center">

                <Box display="flex">

                </Box>

            </Box>

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
                    gridColumn={isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"}
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        overflow: "hidden", // 박스 넘침 방지
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="13px">
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            공지사항
                            <IconButton onClick={handleBoard}>
                                <MoreHoriz style={{ color: "#555" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="8px" height="100%" sx={{ overflow: "auto",}}>
                        {boardList.length > 0 ? (
                            <div style={{
                                overflowX: "auto",
                                overflowY: "auto",
                                scrollbarWidth: "none", /* Firefox */
                                msOverflowStyle: "none", /* IE and Edge */
                                "&::-webkit-scrollbar": { display: "none" } /* Webkit */
                            }}>
                                <table className="table table-hover" style={{ minWidth: "100%" }}>
                                    <thead>
                                    <tr>
                                        <td style={{ width: "50px" }}></td>
                                        <td style={{ textAlign: "center", width: "450px", fontWeight: "bold" }}>
                                            제목
                                        </td>
                                        <td style={{ textAlign: "center", width: "200px", fontWeight: "bold" }}>
                                            작성자
                                        </td>
                                        <td style={{ textAlign: "center", fontWeight: "bold" }}>작성일</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {boardList
                                        .sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate)) // 최신순 정렬
                                        .map((post) => (
                                            <tr key={post.id}>
                                                <td>
                                                    {post.board.mustMustRead && (
                                                        <span style={{ color: "#ff4d4f" }}>
                                        <b>[중요]</b>
                                    </span>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: post.board.mustMustRead ? "bold" : "normal",
                                                        maxWidth: "410px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        cursor: "pointer",
                                                        transition: "color 0.3s",
                                                    }}
                                                    onClick={() => handleTitleClick(post.board.id)}
                                                    onMouseOver={(e) => (e.target.style.color = "#ffb121")}
                                                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                                                >
                                                    {post.board.title}
                                                </td>
                                                <td style={{ textAlign: "center" }}>{post.board.writer}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    {new Date(post.board.createDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                게시글이 없습니다.
                            </Typography>
                        )}
                    </Box>
                </Box>



                {/* 시계 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 1"
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    sx={{
                        background: 'linear-gradient(135deg, #FFB300 20%, #FF6F00 100%)',
                        borderRadius: "8px",  // 부드러운 모서리
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",  // 부드러운 그림자
                        padding: "10px",  // 패딩 추가
                    }}
                >
                    <div class="clockBox">
                        <div class="clockContainer">
                            <div class="clock">
                                <div id="day">{currentDay}</div>
                                <div class="wrapper">
                                    <div id="time">{currentTime}</div>
                                    <div id="midday">{midday}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="buttonbox">
                    <Button class="button" onClick={checkin}>출근</Button>
                        <Button class="button" onClick={checkout}>퇴근</Button>
                    </div>
                </Box>
                {/*날씨*/}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    display="flex"

                    sx={{
                        backgroundColor: "WHITE",
                        borderRadius: "8px",  // 부드러운 모서리
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",  // 부드러운 그림자
                        overflow: "hidden", // 콘텐츠가 Box의 경계를 넘지 않도록 설정
                    }}
                >
                    <Weather/>
                </Box>

                {/* 결재현황 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 효과 추가
                        overflow: "hidden", // 박스 넘침 방지
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="13px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex"
                                    justifyContent="space-between" alignItems="center">
                            결재현황
                            <IconButton onClick={handleList}>
                                <MoreHoriz style={{color: "gray"}}/>
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box  sx={{padding: '5px', alignItems:'center', display:'flex', gap:'5px', justifyContent:'center',marginTop:'10px'}} >
                        <Button style={{ color: 'white', backgroundColor:'#ffb121' , minWidth: '80px',padding: '7px 5px', fontSize:'14px', fontWeight:'bold'}} onClick={() => setStatus("all")}>모두 보기</Button>
                        <Button style={{ color: 'white', backgroundColor:'#ffb121' , minWidth: '80px',padding: '7px 5px', fontSize:'14px', fontWeight:'bold'}} onClick={() => setStatus("rejected")}>반려</Button>
                        <Button style={{ color: 'white', backgroundColor:'#ffb121' , minWidth: '80px',padding: '7px 5px', fontSize:'14px', fontWeight:'bold'}} onClick={() => setStatus("ready")}>결재 대기</Button>
                        <Button style={{color: 'white', backgroundColor:'#ffb121' , minWidth: '80px',padding: '7px 5px', fontSize:'14px', fontWeight:'bold'}} onClick={() => setStatus("ing")}>결재 중</Button>
                        <Button style={{ color: 'white', backgroundColor:'#ffb121' , minWidth: '80px',padding: '7px 5px', fontSize:'14px', fontWeight:'bold'}} onClick={() => setStatus("done")}>결제 완료</Button>

                    </Box>
                    <Box p="10px" flexGrow={1} overflow="auto">
                        {filteredData.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop:'10px'}}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>종류</th>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>제목</th>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>작성자</th>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                        <td style={{ padding: '12px', textAlign: 'center', color: '#555' }}>
                                            {item.appDocType === 0 ? '품의서' :
                                                item.appDocType === 1 ? '휴가신청서' :
                                                    item.appDocType === 2 ? '지출보고서' : ''}
                                        </td>
                                        <td style={{ padding: '12px',textAlign: 'center', color: '#333' }}>
                                            {item.additionalFields.title || '제목 없음'}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center', color: '#555' }}>
                                            {item.writer}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center',
                                            color: item.additionalFields.status ===
                                            '결재 완료' ? '#22ba8a' : item.additionalFields.status === '반려' ? '#ff7133' : '#555'}}>
                                            {item.additionalFields.status}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <Typography variant="body1" color="textSecondary" align="center" mt="20px">
                                데이터가 없습니다.
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* 예약 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    sx={{
                            borderRadius: "8px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            flexDirection: 'column',
                            height: '100%',
                            display: 'flex',
                            overflow: 'hidden',
                          }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="13px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            예약현황
                            <IconButton onClick={handleBook}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <DashboardBook/>
                </Box>

                {/* 캘린더 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        flexDirection: 'column',
                        height: '100%',
                        display: 'flex',
                        overflow: 'hidden',
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="13px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            캘린더
                            <IconButton onClick={handleCalendar}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" flexGrow={1} overflow="auto" sx={{
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '-ms-overflow-style': 'none',  /* IE and Edge */
                        'scrollbar-width': 'none',  /* Firefox */
                    }}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
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
                            height="100%" // FullCalendar 높이를 부모 박스에 맞게 설정
                            headerToolbar={{
                                left: 'customPrev',
                                center: 'title',
                                right: 'customNext'
                            }}
                            showNonCurrentDates={false}
                            contentHeight="auto"
                            dayMaxEventRows={2}  // 한 날짜에 표시할 최대 이벤트 개수
                        />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default Dashboard;
