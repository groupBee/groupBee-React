import {
    Box, Button, FormControl,
    List,
    ListItem,
    ListItemText, MenuItem, Select,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {tokens} from "../../theme";
import {useEffect, useRef, useState} from "react";
import {Header} from "../../components";
import useModal from "./useModal";
import './calendar.css';
import SearchIcon from "@mui/icons-material/Search.js";

const Calendar = () => {
    const fullcalendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);  // 현재 연도 상태 관리

    /* 백엔드 데이터 리스트 출력 */
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

    // datesSet 이벤트 핸들러: 캘린더의 날짜가 변경될 때 호출
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


    /* fullcalendar 관련된 설정 */
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(max-width:920px)");
    const isSmDevices = useMediaQuery("(max-width:600px)");
    const isXsDevices = useMediaQuery("(max-width:380px)");

    const filterEventsForDate = (events, date) => {
        return events.filter(event => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);
            const targetDate = new Date(date);

            eventStartDate.setHours(0, 0, 0, 0);
            eventEndDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            return targetDate >= eventStartDate && targetDate <= eventEndDate;
        });
    };

    const {showModal, deleteModal, modal} = useModal();

    const handleDateClick = async (selected) => {
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        const startStr = selected.startStr.slice(0, 10) + 'T00:30';
        let endStr = selected.endStr.slice(0, 10) + 'T00:30';

        if (selected.endStr) {
            let endDate = new Date(selected.endStr);
            endDate.setDate(endDate.getDate() - 1);
            endStr = endDate.toISOString().slice(0, 10) + 'T00:30';
        }

        const inputValues = await showModal("", "", 'prompt', {
            startDay: startStr,
            endDay: endStr
        });

        if (inputValues) {
            const {title, startDay, endDay, content} = inputValues;

            const event = {
                id: `${selected.startStr}-${title}`,
                title,
                start: new Date(startDay),
                end: new Date(endDay),
                content,
                backgroundColor: '#ffc107',
                borderColor: '#ffc107'
            };

            calendarApi.addEvent(event);
            await fetchData();
        }
    };

    const handleEventClick = async (selected) => {
        if (selected.event.url) {
            // // 구글 캘린더 이벤트인 경우 기본 동작을 막습니다.
            // selected.jsEvent.preventDefault(); // 기본 동작 막기
            // selected.jsEvent.stopPropagation(); // 이벤트 전파 막기
        } else {
            try {
                console.log(selected.event.id);
                if (selected.event.id === "") {
                    return;
                }
                const eventFromDb = await fetch(`/api/calendar/${selected.event.id}`).then(response => response.json());
                const eventData = {
                    id: eventFromDb.id,
                    title: eventFromDb.title,
                    content: eventFromDb.content,
                    startDay: eventFromDb.startDay,
                    endDay: eventFromDb.endDay,
                    bookType: eventFromDb.bookType,
                    corporateCarId: eventFromDb.corporateCarId,
                };

                let result;
                if (eventData.bookType === 0) {
                    result = await showModal(eventData.id, eventData.title, 'confirm', eventData);
                } else {
                    result = await deleteModal(eventData.id, eventData.title, 'delete', eventData);
                }

                if (result) fetchData();
            } catch (error) {
                console.error('이벤트 처리 중 오류 발생:', error);
            }
        }
    };

    return (
        <Box m="20px">
            <Box
                height="100%"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: '30px'

                }}
            >
                    <Typography
                        color="black"
                        variant="h5"
                        fontWeight="600"
                        fontSize="30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        캘린더

                    </Typography>

            <Box display="flex" justifyContent="space-between" gap={2} style={{padding: '40px'}}>
                <Box
                    display={`${isMdDevices ? "none" : "block"}`}
                    flex="1 1 20%"
                    p="15px"
                    borderRadius="4px"
                    sx={{border: '1px solid #ff845e', backgroundColor: 'white'}}
                >
                    <Typography variant="h5" sx={{fontWeight: 'bold', textAlign:'center', fontSize: '16px', color: '#ff845e'}}>오늘의 일정</Typography>
                    <List>
                        {filteredEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    bgcolor: `#ff845e`,
                                    my: "10px",
                                    borderRadius: "5px",
                                    color: 'white'
                                }}
                            >
                                <ListItemText
                                    primary={event.title}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: "1.1em",
                                            fontWeight: "bold"
                                        }
                                    }}
                                    secondary={
                                        <Typography>
                                            {`${new Date(event.start).toLocaleString('ko-KR', {
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                hour12: false
                                            })}`}
                                            {` ~ ${new Date(event.end).toLocaleString('ko-KR', {
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                hour12: false
                                            })}`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box flex="1 1 100%">
                    <FullCalendar
                        height="75vh"
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin,]}
                        headerToolbar={{
                            left: `${isSmDevices ? "prev,next" : "prev,next today"}`,
                            center: "title",
                            right: `${isXsDevices
                                ? ""
                                : isSmDevices
                                    ? "dayGridMonth,listMonth"
                                    : "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                            }`,
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        events={events}
                        ref={fullcalendarRef}
                        showNonCurrentDates={false}
                        select={handleDateClick} // 날짜 클릭 핸들러 추가
                        eventClick={handleEventClick} // 이벤트 클릭 핸들러 추가
                        datesSet={handleDatesSet} // 날짜 변경 시 호출
                        eventsSet={(events) => {
                            setCurrentEvents(events);
                            const today = new Date();
                            const filtered = filterEventsForDate(events, today);
                            setFilteredEvents(filtered);
                        }} // 이벤트가 설정될 때 호출
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false,
                        }}
                        locale='ko'
                    />
                </Box>
            </Box>
            {modal}
            </Box>
        </Box>
    );
};

export default Calendar;
