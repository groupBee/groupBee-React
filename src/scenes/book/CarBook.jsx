import { Box, Button, CardContent, CardMedia, Typography } from "@mui/material";
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
    const [selectedImage, setSelectedImage] = useState(''); // 이미지 저장 state 추가

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

    const getReservationsForCarAndDate = (carId, date) => {
        const selectedDate = new Date(date);
        const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0));
        const selectedDateEnd = new Date(selectedDate.setHours(23, 59, 59, 999));

        return reservations.filter(res => {
            const rentDayDate = new Date(res.rentDay);
            const returnDayDate = new Date(res.returnDay);
            return (
                res.corporateCarId === carId &&
                (rentDayDate <= selectedDateEnd && returnDayDate >= selectedDateStart)
            );
        });
    };

    const generateProgressBar = (reservations, selectedDate) => {
        const totalHours = 24;
        const progressBar = Array(totalHours).fill('#ffb121');

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
                    if (hour === reservationEndHour && reservationEndMinute > 0) {
                        progressBar[hour] = '#cccccc';
                    } else if (hour < reservationEndHour) {
                        progressBar[hour] = '#cccccc';
                    }
                }
            }
        });

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

    const handleCarClick = (car, photo) => {
        setCarDetails(car);
        setSelectedImage(photo); // 이미지 설정
    };

    return (
        <Box m="20px">
            <Box
                height="100%"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                }}
            >
            <Card>
                <Card.Body>
                    <Box className="wrapper" style={{ height: '600px',borderRadius: '8px', border: '1px solid #9F9F9F', marginBottom: '10px', backgroundColor: 'white' }}>
                        {!carDetails ? (
                            <div className="p-3" style={{ borderRadius: '8px', textAlign: 'center' }}>
                                <h5>차량을 선택하세요</h5>
                                <p>아래에서 차량을 클릭하여 차량의 상세 정보를 확인할 수 있습니다.</p>
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
                                <h2 style={{ marginTop:'10px', fontSize: '40px', fontWeight: 'bold', color: 'white'}}>{carDetails.type}</h2>

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
                                        <h5 style={{margin: '0 10px 0 0', marginBottom: '7px', fontWeight: 'bold'
                                        , fontSize: '16px'}}>예약현황</h5>
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
                                             style={{display: 'flex', height: '25px', width: '100%'}}>
                                            {generateProgressBar(getReservationsForCarAndDate(carDetails.id, selectedDate), selectedDate)}
                                        </div>
                                    </div>

                                    <div style={{width: '15%',  display: 'flex',         // Flexbox 적용
                                        justifyContent: 'center',  // 오른쪽으로 정렬
                                        alignItems: 'flex-end', marginTop: '20px',}}>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                width: '110px',
                                                height: '40px',
                                                backgroundColor: '#ffb121',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() => handleShowModal(carDetails)}
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
                            <Box className="card1" key={item.carId}
                                 onClick={() => handleCarClick(item, `https://minio.bmops.kro.kr/groupbee/book/${item.photo}`)}>
                                <img src={`https://minio.bmops.kro.kr/groupbee/book/${item.photo}`}
                                     alt={item.type}/>
                                <Box className="info">
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
        </Box>
    );
};

export default CarBook;
