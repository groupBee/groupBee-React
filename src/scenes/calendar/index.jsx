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
import {formatDate} from "@fullcalendar/core";
import useModal from "./useModal";
import './calendar.css';


const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    /* 백엔드 데이터 리스트 출력 */
    const fetchData = async () => {
        try {
            const calendarResponse = await fetch("/api/calendar/list");
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
            }))
            setEvents(events);
            console.log(events);
        } catch (e) {
            console.error('Error fetching data:', e)
        }
    }

    /* 대한민국 공휴일 받아오기 위한 이벤트 */
    const [googleEvents, setGoogleEvents] = useState([]); // Google Calendar 이벤트 상태
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

    /* Custom Modal 사용을 위함 */
    const {showModal, modal} = useModal();

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
        console.log(startStr);
        console.log(endStr);

        const inputValues = await showModal("일정 추가", "일정을 입력하세요:", 'prompt', {
            startDay: startStr,
            endDay: endStr
        });

        if (inputValues) {
            const {title, startDay, endDay, content} = inputValues;

            const event = {
                id: `${selected.startStr}-${title}`,
                title,
                start: new Date(startDay), // start 값 설정
                end: new Date(endDay), // end 값 설정
                content,
                backgroundColor: '#ffc107',  // 이벤트 배경색
                borderColor: '#ffc107'       // 이벤트 테두리색
            };

            const localStart = new Date(startDay).toISOString();
            const localEnd = new Date(endDay).toISOString();

            console.log(`Adding Event: ${event.title} | Start: ${localStart} | End: ${localEnd}`); // 콘솔에 로그 출력

            calendarApi.addEvent(event);
            fetchData();
        }
    };

    /* 캘린더 데이터 삭제를 위한 이벤트 */
    const handleEventClick = async (selected) => {
        // DB에서 가져온 이벤트 데이터를 사용하는 경우
        const eventFromDb = await fetch(`/api/calendar/${selected.event.id}`).then(response => response.json());

        const eventData = {
            id: eventFromDb.id,
            title: eventFromDb.title,
            content: eventFromDb.content,
            startDay: eventFromDb.startDay,
            endDay: eventFromDb.endDay,
            contentType: eventFromDb.contentType,
        };
        const result = await showModal(
            eventData.id, eventData.title, 'confirm', eventData
        );

        if (result) {
            fetchData();
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
                    <Typography variant="h5">Event</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    bgcolor: `#ffb121`,
                                    my: "10px",
                                    borderRadius: "2px",
                                }}
                            >
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(event.start, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* CALENDAR */}
                <Box
                    flex="1 1 100%"
                >
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
                        dayCellContent={(info) => {
                            return info.date.getDate();
                        }} // 요일 없애기
                        showNonCurrentDates={false}  // 현재 월이 아닌 날짜 숨기기
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        events={events}
                        //eventSources={}
                        eventsSet={(events) => setCurrentEvents(events)}
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
                        }} // 시간 포맷 설정
                        locale='ko' //한국날짜
                    />
                    <Tooltip
                        open={tooltipOpen}
                        title={tooltipContent}
                        placement="bottom"
                        PopperProps={{
                            anchorEl: anchorEl,  // 툴팁 위치 지정
                            disablePortal: true,  // Tooltip 을 부모 요소의 컨텍스트에 추가
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
