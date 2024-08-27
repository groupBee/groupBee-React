import React, { useEffect, useState } from 'react';
import {Box, Button, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery, useTheme} from "@mui/material";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';
import './adminBookPagination.css';
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";

const AdminBook = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [carBookings, setCarBookings] = useState([]);
    const [carData, setCarData] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(4);

    const fetchData = async () => {
        try {
            const carResponse = await fetch('/api/cars/list');
            const carData = await carResponse.json();
            setCarData(carData);

            const carBookingResponse = await fetch('/api/cars/booklist');
            const carBookingData = await carBookingResponse.json();
            setCarBookings(carBookingData);

            const roomResponse = await fetch('/api/rooms/list');
            const roomData = await roomResponse.json();
            setRoomData(roomData);

            const roomBookingResponse = await fetch('/api/rooms/booklist');
            const roomBookingData = await roomBookingResponse.json();
            setRoomBookings(roomBookingData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const handleDelete = async (id, category) => {
        try {
            const result = await Swal.fire({
                title: '정말 삭제하시겠습니까?',
                text: "이 작업은 되돌릴 수 없습니다.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ffb121',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            });

            if (result.isConfirmed) {
                const url = category === '차량'
                    ? `/api/cars/delete/${id}`
                    : `/api/rooms/delete/${id}`;

                const response = await fetch(url, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    if (category === '차량') {
                        setCarBookings(carBookings.filter(booking => booking.id !== id));
                    } else {
                        setRoomBookings(roomBookings.filter(booking => booking.id !== id));
                    }
                    Swal.fire({
                        title: '<strong>삭제 성공</strong>',
                        icon: 'success',
                        html: '예약이 성공적으로 삭제되었습니다.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#ffb121',
                    });
                } else {
                    Swal.fire({
                        title: '<strong>삭제 실패</strong>',
                        icon: 'error',
                        html: '예약 삭제에 실패했습니다.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#ffb121',
                    });
                }
            }
        } catch (error) {
            console.error('삭제 중 에러 발생:', error);
            Swal.fire({
                title: '<strong>삭제 실패</strong>',
                icon: 'error',
                html: '삭제 중 에러가 발생했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });
        }
    };

    const getCarTypeByCarId = (carId) => {
        const car = carData.find(car => car.id === carId);
        return car ? car.type : 'Unknown';
    };

    const getRoomNameByRoomId = (roomId) => {
        const room = roomData.find(room => room.id === roomId);
        return room ? room.name : 'Unknown';
    };

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

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const { localDate, localTime } = convertUTCToLocal(dateTime);

        const formattedTime = localTime.split(':')[0] + '시';
        return `${localDate} ${formattedTime}`;
    };

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTimeToHHMM = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const convertUTCToLocal = (utcDate) => {
        const date = new Date(utcDate);
        return {
            localDate: formatDateToYYYYMMDD(date),
            localTime: formatTimeToHHMM(date)
        };
    };

    // Calculate the index range for the current page
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = combinedBookings.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };

    return (
        <Box style={{padding:'10px'}}>
        <Box bgcolor="" p={1} height="280px" padding="0px">
            <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                        sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
                        onClick={() => setToggled(!toggled)}
                    >
                        <MenuOutlined />
                    </IconButton>
                    <Box
                        display="flex"
                        alignItems="center"
                        bgcolor="white"
                        borderRadius="3px"
                        sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
                    >
                        <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <Select
                    value={sortOrder}
                    onChange={handleSortChange}

                    size="small" // Select 컴포넌트의 크기 조절
                    sx={{
                        minWidth: 120, // 셀렉트의 최소 너비 설정
                    }}
                >
                    <MenuItem value="default">기본 순서</MenuItem>
                    <MenuItem value="ascending">오름차순</MenuItem>
                    <MenuItem value="descending">내림차순</MenuItem>
                    <MenuItem value="date">날짜순</MenuItem>
                </Select>
            </Box>
            <Box borderBottom="1px solid #e0e0e0" />
            <Table>
                <thead>
                <tr>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '4%', paddingLeft: '30px'}}>이름</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '7%'}}>차량/회의실</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '7%', paddingLeft: '30px'}}>아이템</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '13%', paddingLeft: '50px'}}>예약시간</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '13%', paddingLeft: '50px'}}>반납시간</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '30%', paddingLeft: '30px'}}>사유</th>
                    <th style={{backgroundColor: '#ffb121', padding: '12px', width: '11%', paddingLeft: '30px'}}>삭제</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((booking, index) => (
                    <tr key={index}>
                        <td >{booking.memberId}</td>
                        <td style={{padding: '12px', width: '4%', paddingLeft: '30px'}}>{booking.category}</td>
                        <td>{booking.type}</td>
                        <td style={{padding: '12px', width: '4%', paddingLeft: '30px'}}>{formatDateTime(booking.rentDay || booking.enter)}</td>
                        <td style={{padding: '12px', width: '4%', paddingLeft: '30px'}}>{formatDateTime(booking.returnDay || booking.leave)}</td>
                        <td>{booking.reason || booking.purpose}</td>
                        <td>
                            <Button
                                variant=""
                                size="small"
                                onClick={() => handleDelete(booking.id, booking.category)}
                                sx={{
                                    backgroundColor: '#ff5b00',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    borderRadius: '5px',
                                    padding: '6px 12px',
                                    '&:hover': {
                                        backgroundColor: '#c82333',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                삭제
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Box>
    <ReactPaginate
        previousLabel={"<"}  // 이전 페이지 버튼의 레이블
        nextLabel={">"}      // 다음 페이지 버튼의 레이블
        pageCount={Math.ceil(combinedBookings.length / itemsPerPage)}  // 총 페이지 수
        onPageChange={handlePageClick}  // 페이지 변경 시 호출되는 함수
        containerClassName={"pagination"}  // 페이지네이션 컨테이너 클래스 이름
        pageClassName={"page-item"}  // 페이지 번호 버튼 클래스 이름
        pageLinkClassName={"page-link"}  // 페이지 번호 링크 클래스 이름
        previousClassName={"page-item"}  // 이전 버튼 클래스 이름
        previousLinkClassName={"page-link"}  // 이전 버튼 링크 클래스 이름
        nextClassName={"page-item"}  // 다음 버튼 클래스 이름
        nextLinkClassName={"page-link"}  // 다음 버튼 링크 클래스 이름
        breakClassName={"page-item"}  // 생략 아이콘 클래스 이름
        breakLinkClassName={"page-link"}  // 생략 아이콘 링크 클래스 이름
        activeClassName={"active"}  // 현재 활성화된 페이지 번호 버튼 클래스 이름
        sx={{
            marginTop: '10px'
        }}
    />
    </Box>
    );
};

export default AdminBook;
