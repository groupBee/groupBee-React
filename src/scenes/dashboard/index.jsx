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



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" mb="20px" alignItems="center">

                <Box display="flex">
                    <Button style={{ marginRight: '10px' }} onClick={handleCarBook}>예약하기</Button>
                    <Button onClick={handleEmailWrite}>메일보내기</Button>
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
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 효과 추가
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="15px">
                        <Typography
                            color={colors.gray[100]}
                            variant="h5"
                            fontWeight="600"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            공지사항
                            <IconButton onClick={handleBoard}>
                                <MoreHoriz style={{ color: "#555" }} /> {/* 더 어두운 회색으로 변경 */}
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px">
                        {boardList.length > 0 ? (
                            <table className="table table-hover"> {/* 테이블에 hover 효과 추가 */}
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
                                {boardList.map((post) => (
                                    <tr key={post.id}>
                                        <td>
                                            {post.board.mustMustRead && (
                                                <span style={{ color: "#ff4d4f" }}> {/* 눈에 띄는 붉은색 강조 */}
                                                    <b>[중요]</b>
                  </span>
                                            )}
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: post.board.mustMustRead ? "bold" : "normal",
                                                maxWidth: "410px", // 최대 너비 설정
                                                overflow: "hidden", // 넘치는 내용 숨기기
                                                textOverflow: "ellipsis", // 넘치는 내용에 '...' 추가
                                                whiteSpace: "nowrap",
                                                cursor: "pointer",
                                                transition: "color 0.3s", // 마우스 오버 시 부드러운 색상 전환 효과
                                            }}
                                            onClick={() => handleTitleClick(post.id)}
                                            onMouseOver={(e) => (e.target.style.color = "#ffb121")} // 마우스 오버 시 색상 변경
                                            onMouseOut={(e) => (e.target.style.color = "inherit")} // 마우스 아웃 시 원래 색상으로 복구
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
                    gridRow="span 3"
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    sx={{
                        backgroundColor: "#1e1e2f",  // 어두운 배경색
                        borderRadius: "12px",  // 부드러운 모서리
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",  // 부드러운 그림자
                        padding: "20px",  // 패딩 추가
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
                </Box>

                {/* 캘린더 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 효과 추가
                        height:'auto'
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex"
                                    justifyContent="space-between" alignItems="center">
                            캘린더
                            <IconButton onClick={handleCalendar}>
                                <MoreHoriz style={{color: "gray"}}/>
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
                            height="auto"
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

                {/* 결재현황 */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            결재현황
                            <IconButton onClick={handleList}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" flexGrow={1} overflow="auto">
                        <Box display="flex" justifyContent="space-around" mb="10px">
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("rejected")}>반려</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ready")}>결재 대기</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ing")}>결재 중</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("done")}>결제 완료</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("all")}>모두 보기</Button>
                        </Box>
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
                    gridRow="span 3"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box borderBottom={`2px solid #ffb121`} p="15px">
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
