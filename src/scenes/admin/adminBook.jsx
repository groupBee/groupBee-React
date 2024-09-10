import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useMediaQuery,
    Typography,
    Pagination
} from "@mui/material";
import { MenuOutlined, SearchOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from 'sweetalert2';

const AdminBook = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [carBookings, setCarBookings] = useState([]);
    const [carData, setCarData] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [alertMessage, setAlertMessage] = useState("");

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
            setAlertMessage("데이터를 가져오는 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
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
        ...carBookings.map(booking => {
            const car = carData.find(car => car.id === booking.corporateCarId);
            return {
                ...booking,
                type: getCarTypeByCarId(booking.corporateCarId),
                carId: car ? car.carId : 'Unknown',
                category: '차량'
            };
        }),
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = combinedBookings.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box
            gridRow="span 3"
            sx={{
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                maxWidth: '1400px',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto'
            }}
        >
            <Box borderBottom={`2px solid #ffb121`} p="16px">
                <Typography
                    variant="h4"
                    fontWeight="700"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    예약관리
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>이름</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>차량/회의실</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>아이템</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>예약시간</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>반납시간</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>사유</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((booking, index) => (
                            <TableRow key={index}
                                      sx={{
                                          '&:hover': {
                                              backgroundColor: '#f5f5f5',
                                              '& *': {
                                                  color: '#ffb121',
                                              },
                                          },
                                      }}>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{booking.memberId}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{booking.category}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{booking.type} ({booking.carId})</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{formatDateTime(booking.rentDay || booking.enter)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{formatDateTime(booking.returnDay || booking.leave)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{booking.reason || booking.purpose}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                    <IconButton onClick={() => handleDelete(booking.id, booking.category)}>
                                        <DeleteIcon sx={{ fontSize: '1.5rem' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', padding:'20px'}}>
                <Pagination
                    count={Math.ceil(combinedBookings.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    showFirstButton // 처음 페이지로 이동하는 버튼을 표시
                    showLastButton // 마지막 페이지로 이동하는 버튼을 표시
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#000', // 페이지 숫자 기본 색상
                            fontSize: '14px', // 페이지 숫자 크기
                            '&:hover': {
                                backgroundColor: '#ffb121', // 호버 시 배경색
                                color: 'white', // 호버 시 글씨 색상
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#ffb121', // 선택된 페이지 배경색
                                color: 'white', // 선택된 페이지 글씨 색상
                            },
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: '#ffb121', // 생략부(...) 색상
                        },
                        '& .MuiPaginationItem-icon': {
                            color: '#000', // 첫/마지막 페이지로 가는 아이콘 색상
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default AdminBook;
