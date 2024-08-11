import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import { Row, Card, Table, Button } from 'react-bootstrap';

const BookList = () => {
    const [carBookings, setCarBookings] = useState([]);
    const [carData, setCarData] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);
    const [roomData, setRoomData] = useState([]);

    // 데이터 가져오는 함수
    const fetchData = async () => {
        try {
            // 차량 목록 가져오기
            const carResponse = await fetch('/api/cars/list');
            const carData = await carResponse.json();
            setCarData(carData);

            // 차량 예약 목록 가져오기
            const carBookingResponse = await fetch('/api/cars/booklist');
            const carBookingData = await carBookingResponse.json();
            setCarBookings(carBookingData);

            // 회의실 목록 가져오기
            const roomResponse = await fetch('/api/rooms/list');
            const roomData = await roomResponse.json();
            setRoomData(roomData);

            // 회의실 예약 목록 가져오기
            const roomBookingResponse = await fetch('/api/rooms/booklist');
            const roomBookingData = await roomBookingResponse.json();
            setRoomBookings(roomBookingData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (id) => {
        console.log(`Edit booking with ID: ${id}`);
        // 수정 로직 추가
    };

    const handleDelete = (id) => {
        console.log(`Delete booking with ID: ${id}`);
        // 삭제 로직 추가
    };

    // 차량 ID를 기반으로 차량 정보를 가져오기 위한 함수
    const getCarTypeByCarId = (carId) => {
        const car = carData.find(car => car.id === carId);
        return car ? car.type : 'Unknown';
    };

    // 회의실 ID를 기반으로 회의실 정보를 가져오기 위한 함수
    const getRoomNameByRoomId = (roomId) => {
        const room = roomData.find(room => room.id === roomId);
        return room ? room.name : 'Unknown';
    };

    // 차량 예약과 회의실 예약을 합치는 함수
    const combinedBookings = [
        ...carBookings.map(booking => ({
            ...booking,
            type: getCarTypeByCarId(booking.corporateCarId),
            category: '차량'
        })),
        ...roomBookings.map(booking => ({
            ...booking,
            type: getRoomNameByRoomId(booking.roomId),
            category: '회의실'
        }))
    ];

    // 날짜 및 시간 포맷팅 함수
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
            ' ' +
            date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) +
            '시';
    };

    return (
        <Box m="20px">
            <Row>
                <Card style={{padding:'20px'}}>
                    <Card.Body className="px-0 py-2">
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>번호</th> {/* 번호 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>차량/회의실</th> {/* 차량/회의실 구분 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>아이템</th> {/* 차량 종류 또는 회의실 이름 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>예약시간</th> {/* 예약 시간 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>반납시간</th> {/* 반납 시간 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>사유</th> {/* 이유 열 */}
                                <th style={{backgroundColor:'#ffb121',padding:'12px'}}>수정/삭제</th> {/* 수정/삭제 버튼 열 */}
                            </tr>
                            </thead>
                            <tbody>
                            {combinedBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td> {/* 번호 열 */}
                                    <td>{booking.category}</td> {/* 차량 또는 회의실 구분 */}
                                    <td>{booking.type}</td> {/* 차량 종류 또는 회의실 이름 */}
                                    <td>{formatDateTime(booking.rentDay || booking.enter)}</td> {/* 예약 시간 */}
                                    <td>{formatDateTime(booking.returnDay || booking.leave)}</td> {/* 반납 시간 */}
                                    <td>{booking.reason || booking.purpose}</td> {/* 이유 */}
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEdit(booking.memberId)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(booking.memberId)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Row>
        </Box>
    );
};

export default BookList;
