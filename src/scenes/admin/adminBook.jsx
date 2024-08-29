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
    useMediaQuery
} from "@mui/material";
import ReactPaginate from 'react-paginate';
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
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(4);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setAlertMessage("");
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const [newBooking, setNewBooking] = useState({
        category: '',
        type: '',
        carId: '',
        file: null,
        name: '',
        imagePreview: ''
    });

    const handleAddBooking = async () => {
        if (!newBooking.category || !newBooking.file || (newBooking.category === '0' && !newBooking.carId) || (newBooking.category === '1' && !newBooking.name)) {
            setAlertMessage("모든 필드를 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', newBooking.file);
            formData.append('category', newBooking.category);

            if (newBooking.category === '0') {
                formData.append('entityData', JSON.stringify({
                    carId: newBooking.carId,
                    type: newBooking.type
                }));
            } else if (newBooking.category === '1') {
                formData.append('entityData', JSON.stringify({
                    name: newBooking.name
                }));
            }

            const response = await fetch('/api/admin/book/insert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            const result = await response.json();
            Swal.fire({
                title: '<strong>추가 성공</strong>',
                icon: 'success',
                html: '새로운 예약이 성공적으로 추가되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });

            setNewBooking({
                category: '',
                type: '',
                carId: '',
                file: null,
                name: '',
                imagePreview: ''
            });
            handleCloseModal();
            fetchData();

        } catch (error) {
            Swal.fire({
                title: '<strong>추가 실패</strong>',
                icon: 'error',
                html: '예약 추가 중 에러가 발생했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewBooking({
                ...newBooking,
                file: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

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

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = combinedBookings.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };

    return (
        <Box sx={{ padding: '20px'}}>
            <Box  p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box display="flex" alignItems="center" gap={2}>
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
                    <Box display="flex" alignItems="center" gap={1}>
                        <Button  onClick={handleOpenModal}
                                sx={{ textAlign: 'center' , backgroundColor:'#ff7926', fontSize:'13px'
                        ,color: 'white', padding:'7px'}}>
                            차량/회의실 추가
                        </Button>
                        <Select
                            value={sortOrder}
                            onChange={handleSortChange}
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="default">기본 순서</MenuItem>
                            <MenuItem value="ascending">오름차순</MenuItem>
                            <MenuItem value="descending">내림차순</MenuItem>
                            <MenuItem value="date">날짜순</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <Box borderBottom="1px solid #e0e0e0" />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem'}}>이름</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>차량/회의실</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>아이템</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>예약시간</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>반납시간</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>사유</TableCell>
                                <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem'}}>삭제</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentItems.map((booking, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{booking.memberId}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{booking.category}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{booking.type}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{formatDateTime(booking.rentDay || booking.enter)}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{formatDateTime(booking.returnDay || booking.leave)}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{booking.reason || booking.purpose}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>
                                        <IconButton onClick={() => handleDelete(booking.id, booking.category)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={Math.ceil(combinedBookings.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                    sx={{ marginTop: '30px' }}
                />
            </Box>


            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle >차량/회의실 추가</DialogTitle>
                <DialogContent>
                    {alertMessage && (
                        <Box sx={{ mb: 2, color: 'red', textAlign: 'center' }}>
                            {alertMessage}
                        </Box>
                    )}
                    <Select
                        value={newBooking.category}
                        onChange={(e) => setNewBooking({ ...newBooking, category: e.target.value })}
                        fullWidth
                    >
                        <MenuItem value="0">차량</MenuItem>
                        <MenuItem value="1">회의실</MenuItem>
                    </Select>
                    {newBooking.imagePreview && (
                        <Box mt={2} textAlign="center">
                            <img
                                src={newBooking.imagePreview}
                                alt="미리보기"
                                style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
                            />
                        </Box>
                    )}
                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2, backgroundColor:'#ffb121' }}>
                        이미지 업로드
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {newBooking.category === '0' && (
                        <>
                            <TextField
                                margin="dense"
                                label="차량번호"
                                fullWidth
                                variant="outlined"
                                value={newBooking.carId}
                                onChange={(e) => setNewBooking({ ...newBooking, carId: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="차량종류"
                                fullWidth
                                variant="outlined"
                                value={newBooking.type}
                                onChange={(e) => setNewBooking({ ...newBooking, type: e.target.value })}
                            />
                        </>
                    )}

                    {newBooking.category === '1' && (
                        <TextField
                            margin="dense"
                            label="회의실 이름"
                            fullWidth
                            variant="outlined"
                            value={newBooking.name}
                            onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddBooking} color="primary">추가</Button>
                    <Button onClick={handleCloseModal} color="secondary">취소</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminBook;
