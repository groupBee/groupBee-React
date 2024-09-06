import {Box, Button, CardContent, CardMedia, Typography} from "@mui/material";
import { Header } from "../../components";
import React, { useState, useEffect } from 'react';
import { Row, Card } from 'react-bootstrap';
import Bookingmodal from './carbookingmodal.jsx';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './pagination.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DatePicker.css';
import './card.css';




const CarBook = () => {
    const [cars, setCars] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const [carDetails, setCarDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());


    const fetchData = async () => {
        try {
            const carResponse = await fetch('/api/cars/list');
            const carData = await carResponse.json();
            const reservationResponse = await fetch('/api/cars/booklist');
            const reservationData = await reservationResponse.json();
            setCars(carData);
            setReservations(reservationData);
        } catch (error) {
            console.error('데이터를 가져오는 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleShowModal = (item) => {
        setSelectedCar(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCar(null);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = cars.slice(offset, offset + itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    // 선택된 날짜와 차량 ID에 대한 예약을 필터링
    const getReservationsForCarAndDate = (carId, date) => {
        const selectedDate = new Date(date);
        const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0)); // 선택된 날짜의 시작
        const selectedDateEnd = new Date(selectedDate.setHours(23, 59, 59, 999)); // 선택된 날짜의 끝

        return reservations.filter(res => {
            const rentDayDate = new Date(res.rentDay);
            const returnDayDate = new Date(res.returnDay);

            // 예약이 선택된 날짜와 일치하거나 포함하는지 확인
            return (
                res.corporateCarId === carId &&
                (rentDayDate <= selectedDateEnd && returnDayDate >= selectedDateStart)
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
            const rentDayDate = new Date(reservation.rentDay);
            const returnDayDate = new Date(reservation.returnDay);

            const reservationStart = new Date(Math.max(rentDayDate, selectedDateStart));
            const reservationEnd = new Date(Math.min(returnDayDate, selectedDateEnd));

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

    const handleCarClick = (car) => {
        setCarDetails(car);
    };

    return (
        <Box
            gridRow="span 3"
            sx={{
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden", // 박스 넘침 방지
                maxWidth: '1400px',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto'
            }}
        >
                <Card>
                    <Card.Body>
                            <Box class="wrapper" style={{ height: '600px', border: '1px solid black', marginBottom: '10px'}}>
                                {!carDetails ? (
                                    <div className="p-3" style={{ borderRadius: '8px', textAlign: 'center' }}>
                                        <h5>차량을 선택하세요</h5>
                                        <p>왼쪽 열에서 차량을 클릭하여 차량의 상세 정보를 확인할 수 있습니다.</p>
                                    </div>
                                ) : (
                                    <div className="p-3" style={{ borderRadius: '10px', border: '1px solid #ffb121' }}>
                                        <h4>{carDetails.carId}</h4>
                                        <hr />
                                        <div style={{ width: '100px', height:'100px'}}>

                                        </div>
                                        <hr />
                                        <div className="container" style={{ width: '100%', marginTop: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div>00:00</div>
                                                <div>12:00</div>
                                                <div>24:00</div>
                                            </div>
                                            <div className="progress" style={{ display: 'flex', height: '30px', width: '100%' }}>
                                                {generateProgressBar(getReservationsForCarAndDate(carDetails.id, selectedDate), selectedDate)}
                                            </div>
                                        </div>
                                        <hr />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <h6 style={{ margin: '0 10px 0 0' }}>예약현황:</h6>
                                                <DatePicker
                                                    selected={selectedDate}
                                                    onChange={(date) => setSelectedDate(date)}
                                                    showPopperIndicator={true} // 팝업 인디케이터 표시
                                                    dateFormat="yyyy/MM/dd" // 날짜 형식
                                                    className="custom-datepicker"
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{
                                                        width: '100px',
                                                        height: '40px',
                                                        backgroundColor: '#ffb121',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => handleShowModal(carDetails)}
                                                >
                                                    예약
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </Box>
                        <Box class="wrapper">
                            {currentItems && currentItems.map((item) => (
                                <Box class="card1" onClick={() => handleCarClick(item)}>
                                    <img src={`https://minio.bmops.kro.kr/groupbee/book/${item.photo}`} alt={item.type}/>
                                    <Box class="info">
                                        <h1>{item.type}</h1>
                                        <p>차량번호: {item.carId}</p>
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
                pageCount={Math.ceil(cars.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {selectedCar && (
                <Bookingmodal
                    show={showModal}
                    handleClose={handleCloseModal}
                    car={selectedCar}
                    fetchData={fetchData}
                    reservations={reservations}
                />
            )}

        </Box>
    );
};

export default CarBook;
