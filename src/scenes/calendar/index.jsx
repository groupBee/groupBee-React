import { Box, List, ListItem, ListItemText, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { tokens } from "../../theme";
import { useEffect, useRef, useState } from "react";
import { Header } from "../../components";
import useModal from "./useModal";
import './calendar.css';

const Calendar = () => {
    const fullcalendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);  // 무한루프 방지를 위한 플래그

    /* 백엔드 데이터 리스트 출력 */
    const fetchData = async (year) => {
        try {
            const calendarResponse = await fetch(`/api/calendar/korea/2024`);
            if (!calendarResponse.ok) {
                console.error(`${calendarResponse.status}: 오류가 발생했습니다.`);
                return;
            }
            const calendarData = await calendarResponse.json();

            const backendEvents = calendarData.map((event) => ({
                id: event.id,
                title: event.title,
                content: event.content || "",
                start: event.startDay,
                end: event.endDay,
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                textColor: '#111111',
            }));
            setEvents(backendEvents);
        } catch (e) {
            console.error("데이터 로드 중 오류 발생:", e);
        }
    };

    useEffect(() => {
        fetchData()
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

    const { showModal, deleteModal, modal } = useModal();

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
            const { title, startDay, endDay, content } = inputValues;

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
            <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
            <Box display="flex" justifyContent="space-between" gap={2}>
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

                <Box flex="1 1 100%">
                    <FullCalendar
                        height="75vh"
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
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
                        // eventSources={[
                        //     {
                        //         googleCalendarId: CALENDAR_ID,
                        //         className: 'public-holiday',
                        //         color: '#ff0000', // 공휴일은 빨간색으로
                        //         textColor: '#ffffff', // 공휴일 텍스트 색상
                        //     },
                        //     {
                        //         events, // 기존 이벤트
                        //     },
                        // ]}
                        events={events}
                        ref={fullcalendarRef}
                        select={handleDateClick} // 날짜 클릭 핸들러 추가
                        eventClick={handleEventClick} // 이벤트 클릭 핸들러 추가
                        // eventsSet={handleEventsSet} // 이벤트가 설정될 때 호출
                        // eventMouseEnter={(info) => {
                        //     setTooltipContent(info.event.extendedProps.content);
                        //     setAnchorEl(info.el);
                        //     setTooltipOpen(true);
                        // }}
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
                    {/* <Tooltip
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
                        style={{ position: 'fixed' }}
                    >
                        <span />
                    </Tooltip> */}
                </Box>
            </Box>
            {modal}
        </Box>
    );
};

export default Calendar;
