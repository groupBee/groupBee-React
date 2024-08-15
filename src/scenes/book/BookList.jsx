import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import { Row, Card, Table, Button, Modal, Form } from 'react-bootstrap';

const BookList = () => {
    const [carBookings, setCarBookings] = useState([]);
    const [carData, setCarData] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);
    const [roomData, setRoomData] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [category, setCategory] = useState('');
    const [formData, setFormData] = useState({
        rentDay: '',
        returnDay: '',
        enter: '',
        leave: '',
        reason: '',
        purpose: '',
        type: '',
        name: '',
        photo: ''
    });

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

    const handleEdit = (booking) => {
        setCurrentBooking(booking);
        setCategory(booking.category);
        setFormData({
            rentDay: booking.rentDay ? new Date(booking.rentDay).toISOString().slice(0, 16) : '',
            returnDay: booking.returnDay ? new Date(booking.returnDay).toISOString().slice(0, 16) : '',
            reason: booking.reason || '',
            enter: booking.enter ? new Date(booking.enter).toISOString().slice(0, 16) : '',
            leave: booking.leave ? new Date(booking.leave).toISOString().slice(0, 16) : '',
            purpose: booking.purpose || '',
            type: booking.type || '',
            name: booking.name || '',
            photo: booking.photo || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id, category) => {
        try {
            const url = category === '차량'
                ? `/api/cars/delete/${id}`
                : `/api/rooms/delete/${id}`;

            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (response.ok) {
                // 성공적으로 삭제된 경우, 예약 목록에서 해당 항목을 제거
                if (category === '차량') {
                    setCarBookings(carBookings.filter(booking => booking.id !== id));
                } else {
                    setRoomBookings(roomBookings.filter(booking => booking.id !== id));
                }
                alert('예약이 삭제되었습니다.');
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 중 에러 발생:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentBooking(null);
        setCategory('');
    };
    //업데이트
    const handleModalSave = async () => {
        try {
            const url = category === '차량'
                ? `/api/cars/update/${currentBooking.id}`
                : `/api/rooms/update/${currentBooking.id}`;

            const requestBody = category === '차량'
                ? {
                    rentDay: new Date(formData.rentDay).toISOString(),
                    returnDay: new Date(formData.returnDay).toISOString(),
                    reason: formData.reason,
                    corporateCarId: currentBooking.corporateCarId,
                    memberId: currentBooking.memberId
                }
                : {
                    enter: new Date(formData.enter).toISOString(),
                    leave: new Date(formData.leave).toISOString(),
                    purpose: formData.purpose,
                    roomId: formData.roomId,
                    memberId: currentBooking.memberId
                };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // 성공적으로 업데이트된 경우, 예약 목록을 새로고침
                fetchData();
                alert('예약이 업데이트되었습니다.');
            } else {
                alert('업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('업데이트 중 에러 발생:', error);
            alert('업데이트에 실패했습니다.');
        }

        handleModalClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
                <Card style={{ padding: '20px' }}>
                    <Card.Body className="px-0 py-2">
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>번호</th> {/* 번호 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>차량/회의실</th> {/* 차량/회의실 구분 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>아이템</th> {/* 차량 종류 또는 회의실 이름 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>예약시간</th> {/* 예약 시간 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>반납시간</th> {/* 반납 시간 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>사유</th> {/* 이유 열 */}
                                <th style={{ backgroundColor: '#ffb121', padding: '12px' }}>수정/삭제</th> {/* 수정/삭제 버튼 열 */}
                            </tr>
                            </thead>
                            <tbody>
                            {combinedBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td> {/* 번호 열 */}
                                    <td>{booking.category}</td> {/* 차량 또는 회의실 구분 */}
                                    <td>{booking.type}</td>
                                    <td>{formatDateTime(booking.rentDay || booking.enter)}</td> {/* 예약 시간 */}
                                    <td>{formatDateTime(booking.returnDay || booking.leave)}</td> {/* 반납 시간 */}
                                    <td>{booking.reason || booking.purpose}</td> {/* 이유 */}
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEdit(booking)}
                                            className="me-2"
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(booking.id, booking.category)}
                                        >
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Row>

            {/* 수정 모달 */}

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>예약 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {category === '차량' && (
                            <>
                                <Form.Label style={{fontSize: '30px'}}>{formData.type}</Form.Label>
                                <Form.Group className="mb-3">
                                    <Form.Label>예약 시간</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="rentDay"
                                        value={formData.rentDay}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>반납 시간</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="returnDay"
                                        value={formData.returnDay}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>사유</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </>
                        )}


                        {category === '회의실' && (
                            <>
                                <Form.Label style={{fontSize: '30px'}}>{formData.type}</Form.Label>
                                <Form.Group className="mb-3">
                                    <Form.Label>예약 시간</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="enter"
                                        value={formData.enter}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>반납 시간</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="leave"
                                        value={formData.leave}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>사유</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleModalSave}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>
        </Box>
    );
};

export default BookList;
