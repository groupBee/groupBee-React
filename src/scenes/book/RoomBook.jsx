import {Box, Button, CardContent, CardMedia, Typography} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Row, Card } from 'react-bootstrap';
import Bookingmodal from './roombookingmodal.jsx';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './pagination.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DatePicker.css';



const RoomBook = () => {
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;
    const [roomDetails, setRoomDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedImage, setSelectedImage] = useState('');



    const fetchData = async () => {
        try {
            const roomResponse = await fetch('/api/rooms/list');
            const roomData = await roomResponse.json();
            const reservationResponse = await fetch('/api/rooms/booklist');
            const reservationData = await reservationResponse.json();
            setRooms(roomData);
            setReservations(reservationData);
        } catch (error) {
            console.error('데이터를 가져오는 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleShowModal = (item) => {
        setSelectedRoom(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = rooms.slice(offset, offset + itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    // 선택된 날짜와 차량 ID에 대한 예약을 필터링
    const getReservationsForRoomAndDate = (roomId, date) => {
        const selectedDate = new Date(date);
        const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0)); // 선택된 날짜의 시작
        const selectedDateEnd = new Date(selectedDate.setHours(23, 59, 59, 999)); // 선택된 날짜의 끝

        return reservations.filter(res => {
            const enterDayDate = new Date(res.enter);
            const leaveDayDate = new Date(res.leave);

            // 예약이 선택된 날짜와 일치하거나 포함하는지 확인
            return (
                res.roomId === roomId &&
                (enterDayDate <= selectedDateEnd && leaveDayDate >= selectedDateStart)
            );
        });
    };

    // 예약 데이터에 기반하여 프로그래스 바 생성
    const generateProgressBar = (reservations, selectedDate) => {
        const totalHours = 24;
        const progressBar = Array(totalHours).fill('#ffb121'); // 기본 색상 (예: 주황색)

        const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0));
        const selectedDateEnd = new Date(selectedDate.setHours(23, 59, 59, 999));

        reservations.forEach((reservation) => {
            const enterDayDate = new Date(reservation.enter);
            const leaveDayDate = new Date(reservation.leave);

            const reservationStart = new Date(Math.max(enterDayDate, selectedDateStart));
            const reservationEnd = new Date(Math.min(leaveDayDate, selectedDateEnd));

            const reservationStartHour = reservationStart.getHours();
            const reservationEndHour = reservationEnd.getHours();
            const reservationEndMinute = reservationEnd.getMinutes();

            for (let hour = reservationStartHour; hour <= reservationEndHour; hour++) {
                if (hour < totalHours) {
                    // 끝나는 시간의 세그먼트는 분이 0이 아니면 회색으로 설정
                    if (hour === reservationEndHour && reservationEndMinute > 0) {
                        progressBar[hour] = '#cccccc'; // 예약된 시간대 색상 (예: 회색)
                    } else if (hour < reservationEndHour) {
                        progressBar[hour] = '#cccccc'; // 예약된 시간대 색상 (예: 회색)
                    }
                }
            }
        });

        // 프로그래스 바 렌더링
        return progressBar.map((color, index) => (
            <div
                key={index}
                className="progress-bar"
                style={{
                    width: `${100 / totalHours}%`,
                    backgroundColor: color,
                    height: '30px',
                    display: 'inline-block'
                }}
            ></div>
        ));
    };

    const handleRoomClick = (room, photo) => {
        setRoomDetails(room);
        setSelectedImage(photo);
    };

    return (
        <Box
            gridRow="span 3"
            sx={{
                borderRadius: "8px",
                backgroundColor: "white",
                overflow: "hidden",
                maxWidth: '1400px',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto'
                }}
            >
                <Card>
                    <Card.Body>
                        <Box className="wrapper" style={{ height: '600px',borderRadius: '8px', border: '1px solid #9F9F9F', marginBottom: '10px', backgroundColor: 'white' }}>
                            {!roomDetails ? (
                                <div className="p-3" style={{ borderRadius: '8px', textAlign: 'center' }}>
                                    <h5>회의룸을 선택하세요</h5>
                                    <p>아래에서 회의룸을 클릭하여 회의룸의 상세 정보를 확인할 수 있습니다.</p>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${selectedImage})`, // 배경 이미지 설정
                                        backgroundSize: 'cover', // 이미지 크기
                                        backgroundPosition: 'center', // 이미지 위치
                                        display: 'flex', // Flexbox로 변경
                                        flexDirection: 'column', // 세로로 정렬
                                        justifyContent: 'space-between', // 위, 아래로 요소를 배치
                                    }}
                                >
                                    <h2 style={{ marginTop:'10px', fontSize: '45px', fontWeight: 'bold'}}>{roomDetails.name}</h2>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',  // 배경을 반투명하게 설정
                                        width: '100%',  // 부모 요소의 너비에 맞추기
                                        height: '20%',
                                        color: 'white'
                                    }}>
                                        <div style={{width: '15%'}}>
                                            <h5 style={{margin: '0 10px 0 0', marginBottom: '7px', fontWeight: 'bold'}}>예약현황</h5>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                showPopperIndicator={true}
                                                dateFormat="yyyy/MM/dd"
                                                className="custom-datepicker"
                                            />
                                        </div>

                                        <div className="container" style={{width: '70%'}}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%'
                                            }}>
                                                <h1>00:00</h1>
                                                <h1>12:00</h1>
                                                <h1>24:00</h1>
                                            </div>
                                            <div className="progress"
                                                 style={{display: 'flex', height: '30px', width: '100%'}}>
                                                {generateProgressBar(getReservationsForRoomAndDate(roomDetails.id, selectedDate), selectedDate)}
                                            </div>
                                        </div>

                                        <div style={{width: '15%',  display: 'flex',         // Flexbox 적용
                                            justifyContent: 'flex-end',  // 오른쪽으로 정렬
                                            alignItems: 'flex-end', marginTop: '10px' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{
                                                    width: '130px',
                                                    height: '60px',
                                                    backgroundColor: '#ffb121',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '23px',
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={() => handleShowModal(roomDetails)}
                                            >
                                                예약하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Box>
                        <Box className="wrapper">
                            {currentItems && currentItems.map((item) => (
                                <Box className="card1" key={item.id}
                                     onClick={() => handleRoomClick(item, `https://minio.bmops.kro.kr/groupbee/book/${item.photo}`)}>
                                    <img src={`https://minio.bmops.kro.kr/groupbee/book/${item.photo}`}
                                         alt=''/>
                                    <Box className="info">
                                        <h1>{item.name}</h1>

                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card.Body>
                </Card>

            <ReactPaginate
                previousLabel={'이전'}
                nextLabel={'다음'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(rooms.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {selectedRoom && (
                <Bookingmodal
                    show={showModal}
                    handleClose={handleCloseModal}
                    room={selectedRoom}
                    fetchData={fetchData}
                    reservations={reservations}
                />
            )}
        </Box>
    );
};

export default RoomBook;
