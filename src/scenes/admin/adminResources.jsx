import React, {useEffect, useState} from 'react';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    InputBase,
    MenuItem,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, TextField, Typography
} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete.js";
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";


const AdminResources = () => {
    const [adminCar, setAdminCar] = useState([]);
    const [adminRoom, setAdminRoom] = useState([]);
    const [showCarTable, setShowCarTable] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [newBooking, setNewBooking] = useState({
        category: '0',
        type: '',
        carId: '',
        file: null,
        name: '',
        imagePreview: '',
        id:'',

    });
    const [editItem, setEditItem] = useState({
        category: '',  // 기본값 설정
        id:'',
        carId: '',
        type: '',
        name: '',
        imagePreview: '',

    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleToggleTable = () => {
        setShowCarTable(prevShowCarTable => !prevShowCarTable);
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setAlertMessage("");
        setNewBooking(prev => ({
            ...prev,
            category: '0' // 다이얼로그 열 때 기본 카테고리를 차량으로 설정
        }));
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewBooking({
            category: '0', // 기본값 설정
            type: '',
            carId: '',
            file: null,
            name: '',
            imagePreview: '',
            id: '',
        });
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };



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
            setIsModalOpen(false);
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
            const previewUrl = URL.createObjectURL(file);
            if (isEditModalOpen) {
                // 수정 모달이 열려 있을 때는 editItem을 업데이트
                setEditItem(prev => ({
                    ...prev,
                    file: file,
                    imagePreview: previewUrl,
                }));
            } else {
                // 추가 모달이 열려 있을 때는 newBooking을 업데이트
                setNewBooking({
                    ...newBooking,
                    file: file,
                    imagePreview: previewUrl,
                });
            }
        }
    };


    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/book/list/car');
            const carData = await response.json();

            // 차량 데이터에 category 필드 추가 (0)
            const carDataWithCategory = carData.map(item => ({
                ...item,
                category: 0 // 차량은 category 0
            }));
            setAdminCar(carDataWithCategory);
            console.log(carDataWithCategory);

            const response1 = await fetch('/api/admin/book/list/room');
            const roomData = await response1.json();

            // 회의실 데이터에 category 필드 추가 (1)
            const roomDataWithCategory = roomData.map(item => ({
                ...item,
                category: 1 // 회의실은 category 1
            }));
            setAdminRoom(roomDataWithCategory);
            console.log(roomDataWithCategory);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id, category) => {
        // 삭제 확인을 위한 알림 표시
        const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');

        if (!isConfirmed) {
            // 사용자가 삭제를 취소한 경우
            return;
        }

        try {
            // URL에 id와 category를 쿼리 파라미터로 포함
            const url = `/api/admin/book/book/delete?id=${id}&category=${category}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the item');
            }

            // 응답이 있을 때만 JSON으로 파싱
            const text = await response.text();
            if (text) {
                const result = JSON.parse(text);
                console.log('Delete successful:', result);
            } else {

            }

            // 삭제가 완료된 후 리스트를 다시 가져와서 화면에 업데이트
            fetchData();
        } catch (error) {
            console.error('Error deleting the item:', error);
        }
    };

    const handleEdit = (item) => {
        setEditItem({ ...item, imagePreview: `https://minio.bmops.kro.kr/groupbee/book/${item.photo}` });
        setIsEditModalOpen(true);
        console.log(item+'item');
    };

    const handleUpdate = async () => {
        console.log(editItem);
        try {
            // FormData 객체 생성
            const formData = new FormData();

            // 새로운 파일이 있을 경우, 파일을 FormData에 추가
            if (editItem.file) {
                formData.append('file', editItem.file); // 'photo' 키로 파일 추가
            }

            // 나머지 필드 추가

            formData.append('id', editItem.id);
            formData.append('carId', editItem.carId);
            formData.append('type', editItem.type);
            formData.append('name', editItem.name);


            // 카테고리에 따라 URL 결정
            const url = editItem.category === 0
                ? '/api/admin/book/update/car'
                : '/api/admin/book/update/room';

            // 업데이트 요청 보내기
            const response = await fetch(url, {
                method: 'PATCH',
                body: formData
            });

            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            Swal.fire({
                title: '<strong>수정 성공</strong>',
                icon: 'success',
                html: '정보가 성공적으로 수정되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });

            // 상태 초기화 및 모달 닫기
            setEditItem({
                category: '',
                carId: '',
                type: '',
                name: '',
                imagePreview: '',
                id: '',
                file: null
            });
            setIsEditModalOpen(false);
            fetchData(); // 데이터 새로고침

        } catch (error) {
            Swal.fire({
                title: '<strong>수정 실패</strong>',
                icon: 'error',
                html: '수정 중 에러가 발생했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });
        }
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
            <Box borderBottom={`2px solid #ffb121`} p="16px">
                <Typography
                    variant="h4"
                    fontWeight="700"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    자원관리
                    <Box>
                    <Button variant="h4" onClick={handleToggleTable}
                            sx={{
                        border: '1px solid #ffb121',
                        color: 'white',
                        backgroundColor: '#ffb121',
                        fontSize: '14px',
                        borderRadius: "8px",
                        fontWeight: 'bold',
                        marginRight: '10px',
                        '&:hover': {
                            backgroundColor: 'white', // 호버 시 배경색 변경
                            borderColor: '1px solid #ffb121', // 호버 시 테두리 색상 변경
                            color: '#ffb121', // 호버 시 텍스트 색상 변경
                        }
                    }}
                    >
                        {showCarTable ? '회의실보기' : '차량보기'}</Button>
                    <Button  variant="h4" onClick={handleOpenModal}
                             sx={{
                                 border: '1px solid #ffb121',
                                 color: 'white',
                                 backgroundColor: '#ffb121',
                                 fontSize: '14px',
                                 borderRadius: "8px",
                                 fontWeight: 'bold',
                                 '&:hover': {
                                     backgroundColor: 'white', // 호버 시 배경색 변경
                                     borderColor: '1px solid #ffb121', // 호버 시 테두리 색상 변경
                                     color: '#ffb121', // 호버 시 텍스트 색상 변경
                                 }}}>추가</Button>
                    </Box>
                </Typography>
            </Box>
                <TableContainer component={Paper}>
                    {showCarTable ? (
                        // 첫 번째 테이블 (Car Table)
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>사진</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>종류</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>차량번호</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>삭제</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>수정</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {adminCar.map((car, index) => (
                                    <TableRow
                                        sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5', // 호버 시 배경 색상
                                            '& *': {
                                                color: '#ffb121', // 호버 시 모든 자식 요소의 텍스트 색상
                                            },
                                        },
                                    }}>
                                        <TableCell align="center">
                                            <img
                                                src={`https://minio.bmops.kro.kr/groupbee/book/${car.photo}`}
                                                alt=''
                                                style={{
                                                    width: '200px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '5px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{fontSize: '0.9rem'}}>{car.type}</TableCell>
                                        <TableCell align="center" sx={{fontSize: '0.9rem'}}>{car.carId}</TableCell>
                                        <TableCell align="center" sx={{fontSize: '0.9rem'}}>
                                            <IconButton onClick={() => handleDelete(car.id, car.category)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center" sx={{fontSize: '0.9rem'}}>
                                            <IconButton onClick={() => handleEdit(car)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        // 두 번째 테이블 (Room Table)
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>사진</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>이름</TableCell>
                                    <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>삭제</TableCell>
                                    <TableCell align="center" sx={{  width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>수정</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {adminRoom.map((room, index) => (
                                    <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                        <TableCell align="center">
                                            <img
                                            src={`https://minio.bmops.kro.kr/groupbee/book/${room.photo}`}
                                            alt=''
                                            style={{
                                                width: '200px',
                                                height: '120px',
                                                objectFit: 'cover',
                                                borderRadius: '5px'
                                            }}
                                             />
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{room.name}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                            <IconButton onClick={() => handleDelete(room.id, room.category)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center" sx={{fontSize: '0.9rem'}}>
                                            <IconButton onClick={() => handleEdit(room)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>

            {/*추가모달*/}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle >차량/회의실 추가</DialogTitle>
                <DialogContent>
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
                    {alertMessage && (
                        <Box sx={{ mb: 2, color: 'red', textAlign: 'center' }}>
                            {alertMessage}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions style={{marginRight:'10px'}}>
                    <Button onClick={handleAddBooking} color="primary">추가</Button>
                    <Button onClick={handleCloseModal} color="secondary">취소</Button>
                </DialogActions>
            </Dialog>

            {/*수정모달*/}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <DialogTitle>
                    {editItem.category === 0 ? '차량 수정' : '회의실 수정'}
                </DialogTitle>
                <DialogContent>
                    {editItem.imagePreview && (
                        <Box mt={2} textAlign="center">
                            <img
                                src={editItem.imagePreview}
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
                    {editItem.category === 0 && (
                        <Box sx={{marginTop:'8px'}}>
                            <TextField
                                margin="dense"
                                label="차량번호"
                                fullWidth
                                variant="outlined"
                                value={editItem.carId}
                                onChange={(e) => setEditItem({ ...editItem, carId: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="차량종류"
                                fullWidth
                                variant="outlined"
                                value={editItem.type}
                                onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                            />
                        </Box>
                    )}
                    {editItem.category === 1 && (
                        <Box sx={{marginTop:'8px'}}>
                        <TextField
                            margin="dense"
                            label="회의실 이름"
                            fullWidth
                            variant="outlined"
                            value={editItem.name}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                        />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdate} color="primary">수정</Button>
                    <Button onClick={() => setIsEditModalOpen(false)} color="secondary">취소</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminResources;