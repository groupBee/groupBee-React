import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";

const DeleteModal = ({isOpen, onCancel, onDelete, initialData}) => {
    const [carName, setCarName] = useState('');
    const [carImage, setCarImage] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomImage, setRoomImage] = useState('');

    // useEffect(() => {
    //     if (initialData?.corporateCarId && isOpen) {
    //         fetch(`/api/cars/detail/${initialData.corporateCarId}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setCarName(data.carId || '')
    //                 setCarImage(data.photo || '')
    //             })
    //             .catch(err => console.error("deleteModal Error:", err));
    //     }
    // }, [initialData?.corporateCarId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            console.log(initialData?.roomId);
            console.log(initialData.corporateCarId);
            if (initialData?.bookType === 1 && initialData?.corporateCarId) {
                // 자동차 정보 가져오기
                fetch(`/api/cars/detail/${initialData.corporateCarId}`)
                    .then(response => response.json())
                    .then(data => {
                        setCarName(data.carId || '')
                        setCarImage(data.photo || '')
                    })
                    .catch(err => console.error("Car fetch error:", err));
            } else if (initialData?.bookType === 2 && initialData?.corporateCarId) {
                // 회의실 정보 가져오기
                fetch(`/api/rooms/detail/${initialData.corporateCarId}`)
                    .then(response => response.json())
                    .then(data => {
                        setRoomName(data.name || '')
                        setRoomImage(data.photo || '')
                    })
                    .catch(err => console.error("Room fetch error:", err));
            }
        }
    }, [initialData?.bookType, initialData?.corporateCarId, initialData?.roomId, isOpen])

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2); // 연도 마지막 두 자리
        const month = date.toLocaleDateString('ko-KR', { month: 'long' }).replace(' ', ''); // '8월'
        const day = date.getDate(); // 날짜
        const time = date.getHours(); // 시간 (정각 기준)
        return `${year}년 ${month} ${day}일 ${time}시`;
    };

    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle variant="h3" component="h2"
                         sx={{
                             fontSize: '1.5rem',
                             backgroundImage: 'linear-gradient(to right, #FFA800, #FFD600)',
                             color: 'white'
                         }}>
                {initialData?.bookType === 1 ? '자동차 예약 정보' : '회의실 예약 정보'}
            </DialogTitle>
            <DialogContent
                sx={{

                    padding: '0px'
                }}>
                <Box style={{ width:'500px', height:'300px',}}>
                    <img
                        src={initialData?.bookType === 1
                            ? `https://minio.bmops.kro.kr/groupbee/book/${carImage}`
                            : `https://minio.bmops.kro.kr/groupbee/book/${roomImage}`
                        }
                        alt={initialData?.bookType === 1 ? carImage : roomImage}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',

                        }}
                    />
                </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            color: 'black',
                            padding: '18px',


                        }}>
                    <Typography variant="h5">{initialData?.bookType === 1 ? `차량번호 : ${carName || ''}` : `회의실 : ${roomName || ''}`}</Typography>
                    <Typography variant="h5">대여시간 : {formatDate(initialData?.startDay) || ''} ~ {formatDate(initialData?.endDay) || ''}</Typography>
                    <Typography variant="h5">사유 : {initialData?.content || ''}</Typography>
                </Box>
                <DialogActions mt={1}
                >
                    <Button onClick={onDelete} variant="outlined" color="secondary"
                            sx={{
                                fontSize: '1rem',
                                color: 'white',
                                backgroundColor: '#ffb121',
                                border: '1px solid #ffb121',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                },
                            }}>삭제</Button>
                    <Button onClick={onCancel} variant="outlined" color="warning" sx={{
                        fontSize: '1rem',
                        color: 'white',
                        backgroundColor: '#ffb121',
                        border: '1px solid #ffb121',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#ffb121',
                            border: '1px solid #ffb121',
                        },
                    }}>취소</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
