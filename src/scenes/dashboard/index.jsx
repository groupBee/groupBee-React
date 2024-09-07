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
    const [currentYear, setCurrentYear] = useState(null);  // 현재 연도 상태 관리
    const fullcalendarRef = useRef(null);


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
    const fetchData = async (year) => {
        if(!year || year === "") {
            year = currentYear || new Date().getFullYear();
        }
        try {
            const calendarResponse = await fetch(`/api/calendar/list/${year}`);
            if (!calendarResponse.ok) {
                console.error(`${calendarResponse.status}: 오류가 발생했습니다.`);
                return;
            }
            const calendarData = await calendarResponse.json();

            const backendEvents = calendarData.map((event) => {
                // ID가 null이거나 빈 문자열일 경우 색상을 다르게 설정
                const isHoliday = !event.id || event.id === "";  // ID가 null이거나 빈 문자열이면 true
                return {
                    id: event.id || "",
                    title: event.title,
                    content: event.content || "",
                    start: event.startDay,
                    end: event.endDay,
                    backgroundColor: isHoliday ? '#ff0000' : '#ffc107',  // 공휴일이면 빨간색, 아니면 노란색
                    borderColor: isHoliday ? '#ff0000' : '#ffc107',      // 공휴일이면 빨간색, 아니면 노란색
                    textColor: isHoliday ? '#ffffff' : '#000000',
                    allDay: isHoliday,
                };
            });
            setEvents(backendEvents);
        } catch (e) {
            console.error("데이터 로드 중 오류 발생:", e);
        }
    };
    const handleDatesSet = (dateInfo) => {
        if (dateInfo && dateInfo.start) {  // dateInfo와 start가 정의되어 있는지 확인
            const newYear = dateInfo.start.getFullYear();  // 현재 보이는 캘린더의 연도 가져오기
            console.log("Current Year:", newYear);  // 연도 확인용 로그
            // 이미 불러온 연도와 같다면 API 호출하지 않음
            if (newYear !== currentYear) {
                setCurrentYear(newYear);  // 새로운 연도로 상태 업데이트
                fetchData(newYear);  // fetchData에 새로운 연도 전달
            } else {
                console.log("중복된 연도 요청: ", newYear);  // 중복 요청 방지 로그
            }
        } else {
            console.error("dateInfo 또는 dateInfo.start가 정의되지 않았습니다.");
        }
    };

    useEffect(() => {
        if (fullcalendarRef.current) {
            const calendarApi = fullcalendarRef.current.getApi();
            const initialDate = calendarApi.getDate();  // FullCalendar의 초기 날짜 가져오기
            const initialYear = initialDate.getFullYear();  // 초기 연도 추출
            setCurrentYear(initialYear);  // 초기 연도 설정
            fetchData(initialYear);  // 초기 연도로 fetchData 호출
        }
    }, []);

    // 공지사항 데이터 가져오기
    const fetchBoardList = async () => {
        try {
            const res = await axios.get('/api/board/list');

            // 중요 게시물과 일반 게시물 구분
            const importantPosts = res.data.filter(post => post.board.mustMustRead);
            const regularPosts = res.data.filter(post => !post.board.mustMustRead);

            // 중요 게시물 정렬 (최신순)
            const sortedImportantPosts = importantPosts.sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate));

            // 중요 게시물 중 최대 8개만 표시
            const maxImportantCount = 8;
            const displayedImportantPosts = sortedImportantPosts.slice(0, maxImportantCount);

            // 중요 게시물 중 초과된 게시물은 일반 게시물에 추가
            const updatedRegularPosts = [
                ...regularPosts,
                ...sortedImportantPosts.slice(maxImportantCount)
            ].sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate));

            // 중요 게시물과 일반 게시물을 합쳐서 최대 9개만 표시
            const combinedPosts = [
                ...displayedImportantPosts,
                ...updatedRegularPosts.slice(0, 9 - displayedImportantPosts.length)
            ];

            // 최종 게시물 리스트 구성
            const finalPosts = combinedPosts.map(post => ({
                ...post,
                displayNumber: post.board.mustMustRead ? <b style={{ color: 'red', marginLeft: '-5px' }}>[중요]</b> : undefined,
                titleDisplay: post.board.title
            }));

            setBoardList(finalPosts);
            setTotalPages(Math.ceil(updatedRegularPosts.length / 8)); // 총 페이지 수 업데이트
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

    const moveDetail = (itemId) => {
        navigate("/detail", {
            state: {
                memberId: memberId,
                itemId: itemId
            }
        });
    };

    // 버튼 공통 스타일
    const buttonStyle = {
        color: 'white',
        border:'1px solid #ff8c00',
        backgroundColor:'#ffb121',
        minWidth: '80px',
        padding: '7px 5px',
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '0 1px'
    };

    // 선택된 버튼에 따라 색상 변경
    const getButtonStyle = (currentStatus) => ({
        ...buttonStyle,
        backgroundColor: status === currentStatus ? '#ff8c00' : 'white',
        color: status === currentStatus ? 'white' : '#ff8c00',// 선택된 버튼은 색상 진하게
    });


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
                    <Box p="8px" height="100%" sx={{ overflow: "auto"}}>
                        {boardList.length > 0 ? (
                            <div style={{
                                overflowX: "auto",
                                overflowY: "auto",
                                scrollbarWidth: "none", /* Firefox */
                                msOverflowStyle: "none", /* IE and Edge */
                                "&::-webkit-scrollbar": { display: "none" } /* Webkit */
                            }}>
                                <table className="table table-hover" style={{minWidth: "100%"}}>
                                    <thead>
                                    <tr>
                                        <td style={{width: "50px"}}></td>
                                        <td style={{textAlign: "center", width: "450px", fontWeight: "bold"}}>
                                            제목
                                        </td>
                                        <td style={{textAlign: "center", width: "200px", fontWeight: "bold"}}>
                                            작성자
                                        </td>
                                        <td style={{textAlign: "center", fontWeight: "bold"}}>작성일</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {boardList
                                        .filter(post => post.board.mustMustRead) // mustMustRead가 true인 게시글만 필터링
                                        .sort((a, b) => {
                                            // 날짜 기준으로 정렬 (최신 순)
                                            return new Date(b.board.createDate) - new Date(a.board.createDate);
                                        })
                                        .slice(0, 8) // 최신순으로 최대 8개만 선택
                                        .map((post) => (
                                            <tr key={post.id}>
                                                <td>
                                                    {post.board.mustMustRead && (
                                                        <span style={{color: "#ff4d4f"}}>
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
                                                        textAlign:'center'
                                                    }}
                                                    onClick={() => handleTitleClick(post.board.id)}
                                                    onMouseOver={(e) => (e.target.style.color = "#ffb121")}
                                                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                                                >
                                                    {post.board.mustRead ? "[공지] " : ""}
                                                    {post.board.title}
                                                </td>
                                                <td style={{textAlign: "center"}}>{post.board.writer}</td>
                                                <td style={{textAlign: "center"}}>
                                                    {new Date(post.board.createDate).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
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
                            결재수신현황
                            <IconButton onClick={handleList}>
                                <MoreHoriz style={{color: "gray"}}/>
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box  sx={{padding: '5px', alignItems:'center', display:'flex', gap:'5px', justifyContent:'center',marginTop:'10px'}} >
                        <Button
                            style={getButtonStyle("all")}
                            onClick={() => setStatus("all")}
                        >
                            모두 보기
                        </Button>
                        <Button
                            style={getButtonStyle("rejected")}
                            onClick={() => setStatus("rejected")}
                        >
                            반려
                        </Button>
                        <Button
                            style={getButtonStyle("ready")}
                            onClick={() => setStatus("ready")}
                        >
                            결재 대기
                        </Button>
                        <Button
                            style={getButtonStyle("ing")}
                            onClick={() => setStatus("ing")}
                        >
                            결재 중
                        </Button>
                        <Button
                            style={getButtonStyle("done")}
                            onClick={() => setStatus("done")}
                        >
                            결재 완료
                        </Button>
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
                                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0', cursor:'pointer'}} onClick={() => moveDetail(item.id)}>
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
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
                            height="100%"
                            headerToolbar={{
                                left: 'customPrev',
                                center: 'title',
                                right: 'customNext'
                            }}
                            datesSet={handleDatesSet} // 날짜 변경 시 호출
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
