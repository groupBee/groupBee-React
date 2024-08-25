import {Box, List, ListItem, ListItemText, Tooltip, Typography, useMediaQuery, useTheme,} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import {tokens} from "../../theme";
import {useEffect, useRef, useState} from "react";
import {Header} from "../../components";
import useModal from "./useModal";
import './calendar.css';

const Calendar = () => {
    const fullcalendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);

    /* 백엔드 데이터 리스트 출력 */
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
                    console.error("502: Gate way 오류가 발생했습니다.");
                }
                else {
                    console.error(`${calendarResponse.status}: 알 수 없는 오류가 발생했습니다.`);
                }
                // FullCalendar 초기화
                const calendarApi = fullcalendarRef.current.getApi();
                calendarApi.removeAllEvents();
                return;
            }
            const calendarData = await calendarResponse.json();

            const events = calendarData.map((event, index) => ({
                id: event.id,
                title: event.title,
                content: event.content,
                start: event.startDay,
                end: event.endDay,
                backgroundColor: '#ffc107',     // 이벤트 배경색
                borderColor: '#ffc107',         // 이벤트 테두리색
                textColor: '#111111',
            }));
            setEvents(events);
            console.log(events);
        } catch (e) {
            console.log("받아올 데이터가 없습니다.")
            // 오류 발생 시 FullCalendar 초기화
            const calendarApi = fullcalendarRef.current.getApi();
            calendarApi.removeAllEvents();  // 모든 이벤트 제거
        }
    };

    /* 대한민국 공휴일 받아오기 위한 이벤트 */
    const [googleEvents, setGoogleEvents] = useState([]);
    const CALENDAR_ID = 'ko.south_korea#holiday@group.v.calendar.google.com';
    const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;

    useEffect(() => {
        fetchData(); // 백엔드 이벤트 가져오기
    }, []);

    /* fullcalendar 관련된 설정 */
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(max-width:920px)");
    const isSmDevices = useMediaQuery("(max-width:600px)");
    const isXsDevices = useMediaQuery("(max-width:380px)");
    const [currentEvents, setCurrentEvents] = useState([]);

    /* 특정 날짜에 해당하는 이벤트 필터링 */
    const filterEventsForDate = (events, date) => {
        return events.filter(event => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);
            const targetDate = new Date(date);

            // 시간 정보를 0으로 설정하여 날짜만 비교
            eventStartDate.setHours(0, 0, 0, 0);
            eventEndDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            // 오늘 날짜가 이벤트 기간에 포함되는지 확인
            return targetDate >= eventStartDate && targetDate <= eventEndDate;
        });
    };

    /* Custom Modal 사용을 위함 */
    const {showModal, deleteModal, modal} = useModal();

    /* 캘린더 데이터 추가를 위한 이벤트 */
    const handleDateClick = async (selected) => {
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        // 선택된 날짜를 ISO 8601 형식으로 변환
        const startStr = selected.startStr.slice(0, 10) + 'T00:30';
        let endStr = selected.endStr.slice(0, 10) + 'T00:30';

        if (selected.endStr) {
            let endDate = new Date(selected.endStr);
            endDate.setDate(endDate.getDate() - 1);
            endStr = endDate.toISOString().slice(0, 10) + 'T00:30';
        }

        const inputValues = await showModal("일정 추가", "일정을 입력하세요:", 'prompt', {
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
            fetchData();
        }
    };

    /* 캘린더 데이터 삭제를 위한 이벤트 */
    const handleEventClick = async (selected) => {
        try {
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
            console.error('Calendar index handleEventClick error:', error);
        }
    };

    return (
        <Box m="20px">
            <Header title="Calendar" subtitle="Full Calendar Interactive Page"/>
            <Box display="flex" justifyContent="space-between" gap={2}>
                {/* CALENDAR SIDEBAR */}
                <Box
                    display={`${isMdDevices ? "none" : "block"}`}
                    flex="1 1 20%"
                    bgcolor={colors.primary[400]}
                    p="15px"
                    borderRadius="4px"
                >
                    <Typography variant="h5">오늘의 일정</Typography>
                    <List>
                        {filteredEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    bgcolor: `#ffb121`,
                                    my: "10px",
                                    borderRadius: "5px",
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

                {/* CALENDAR */}
                <Box flex="1 1 100%">
                    <FullCalendar
                        height="75vh"
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
                        headerToolbar={{
                            left: `${isSmDevices ? "prev,next" : "prev,next today"}`,
                            center: "title",
                            right: `${
                                isXsDevices
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
                        googleCalendarApiKey={API_KEY}
                        dayCellContent={(info) => info.date.getDate()}
                        showNonCurrentDates={false}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        events={events}
                        ref={fullcalendarRef}
                        eventsSet={(events) => {
                            setCurrentEvents(events);
                            const today = new Date();
                            const filtered = filterEventsForDate(events, today);
                            setFilteredEvents(filtered);
                        }}
                        eventMouseEnter={(info) => {
                            setTooltipContent(info.event.extendedProps.content);
                            setAnchorEl(info.el);
                            setTooltipOpen(true);
                        }}
                        eventMouseLeave={() => {
                            setTooltipOpen(false);
                            setAnchorEl(null);
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false,
                        }}
                        locale='ko'
                    />
                    <Tooltip
                        open={tooltipOpen}
                        title={tooltipContent}
                        placement="bottom"
                        PopperProps={{
                            anchorEl: anchorEl,
                            disablePortal: true,
                            sx: {
                                '.MuiTooltip-tooltip': {
                                    fontSize: '13px',
                                    color: '#ffffff',
                                    backgroundColor: '#333333',
                                    borderRadius: '4px',
                                    padding: '8px',
                                }
                            },
                            modifiers: [
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        padding: 8,
                                    },
                                },
                                {
                                    name: 'flip',
                                    options: {
                                        fallbackPlacements: ['top', 'bottom'],
                                    },
                                },
                            ],
                        }}
                        style={{position: 'fixed'}}
                    >
                        <span/>
                    </Tooltip>
                </Box>
            </Box>
            {modal}
        </Box>
    );
};

export default Calendar;
