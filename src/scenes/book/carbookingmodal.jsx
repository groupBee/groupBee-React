import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const Carbookingmodal = ({ show, handleClose, car, fetchData, reservations }) => {
    const today = new Date().toISOString().split('T')[0];
    const [rentDay, setRentDay] = useState('');
    const [rentTime, setRentTime] = useState('');
    const [returnDay, setReturnDay] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [reason, setReason] = useState('');
    const [bookedTimes, setBookedTimes] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (car) {
            const carReservations = reservations.filter(res => res.corporateCarId === car.id);
            const bookedSlots = {};

            carReservations.forEach(reservation => {
                const start = new Date(reservation.rentDay);
                const end = new Date(reservation.returnDay);

                // 마지막 시간대를 제외하기 위해 end 시간을 1시간 전으로 설정합니다
                const adjustedEnd = new Date(end.getTime() - 60 * 60 * 1000); // 1시간 전

                while (start <= adjustedEnd) {
                    bookedSlots[`${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}T${String(start.getHours()).padStart(2, '0')}:00`] = true;
                    start.setHours(start.getHours() + 1);
                }
            });

            setBookedTimes(bookedSlots);
        }
    }, [car, reservations]);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        setRentDay(currentDate);
        setReturnDay(currentDate);
    }, []);

    useEffect(() => {
        console.log('Booked Slots:', bookedTimes);
    }, [bookedTimes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return; // 오류가 있을 경우 폼 제출을 중단합니다.
        }

        const rentDateTime = `${rentDay}T${rentTime}:00`;
        const returnDateTime = `${returnDay}T${returnTime}:00`;


        const bookingData = {
            corporateCarId: car.id,
            rentDay: rentDateTime,
            returnDay: returnDateTime,
            reason,
        };

        try {
            await axios.post('/api/cars/insert', bookingData);
            Swal.fire({
                title: '<strong>예약 성공</strong>',
                icon: 'success',
                html: '차량 예약이 성공적으로 완료되었습니다.',
                focusConfirm: false,
                confirmButtonText: '확인',
                confirmButtonColor: '#ffb121',
            });
            handleClose(); // 예약 후 모달 닫기
            fetchData(); // 예약 후 데이터 새로고침
        } catch (error) {
            console.error('Error booking car:', error);
            if (error.response && error.response.status === 409 ) {
                Swal.fire({
                    title: '예약 실패',
                    text: '해당 시간은 이미 예약이 완려되었습니다. 다시 시도해 주세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#ffb121',
                });
                handleClose();
                fetchData();
            } else {
                Swal.fire({
                    title: '예약 실패',
                    text: '차량 예약 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#ffb121',
                });
                handleClose();
                fetchData();
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!rentDay) errors.rentDay = '대여일을 입력해 주세요.';
        if (!rentTime) errors.rentTime = '대여 시간을 선택해 주세요.';
        if (!returnDay) errors.returnDay = '반납일을 입력해 주세요.';
        if (!returnTime) errors.returnTime = '반납 시간을 선택해 주세요.';
        if (!reason) errors.reason = '예약 사유를 입력해 주세요.';

        const rentDateTime = `${rentDay}T${rentTime}:00`;
        const returnDateTime = `${returnDay}T${returnTime}:00`;

        if (new Date(rentDateTime) >= new Date(returnDateTime)) {
            errors.dateTime = '반납 시간은 대여 시간보다 늦어야 합니다.';
        }


        // 대여 시간과 반납 시간 사이의 시간대를 체크
        let currentDateTime = new Date(rentDateTime);
        while (currentDateTime < new Date(returnDateTime)) {
            const date = `${currentDateTime.getFullYear()}-${String(currentDateTime.getMonth() + 1).padStart(2, '0')}-${String(currentDateTime.getDate()).padStart(2, '0')}`;
            const time = `${String(currentDateTime.getHours()).padStart(2, '0')}:00`;

            if (isTimeBooked(date, time)) {
                errors.dateTime = '이 시간대는 이미 예약되어 있습니다.';
                break;
            }

            currentDateTime.setHours(currentDateTime.getHours() + 1); // 1시간 단위로 증가
        }

        return errors;
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
        setErrors({ ...errors, [event.target.name]: '' }); // 입력값 변경 시 에러 메시지 초기화
    };

    //시간 select
    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const hour = String(i).padStart(2, '0');
            times.push(`${hour}:00`);
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const isTimeBooked = (date, time) => {
        return bookedTimes[`${date}T${time}`] === true;
    };
    console.log('isTimeBooked'+isTimeBooked)


// 새로운 isTimeBooked 함수
    const isTimeBookedWithExceptions = (date, time) => {
        const sortedTimes = Object.keys(bookedTimes).sort(); // 예약된 시간을 정렬
        const exceptionTimes = [];

        let lastBookedTime = null;

        // 연속되지 않은 첫 번째 시간을 찾기
        sortedTimes.forEach((dateTimeKey, index) => {
            const currentDateTime = new Date(dateTimeKey);

            if (lastBookedTime) {
                // 두 시간 간격을 계산 (시간 차이)
                const diffInHours = (currentDateTime - lastBookedTime) / (1000 * 60 * 60);
                if (diffInHours > 1) {
                    exceptionTimes.push(sortedTimes[index]); // 연속되지 않은 첫 번째 시간대
                }
            }
            lastBookedTime = currentDateTime;
        });

        // 예외 시간대라면 false 반환
        if (exceptionTimes.includes(`${date}T${time}`)) {
            return false;
        }

        // 그 외는 기존 로직 유지
        return isTimeBooked(date, time);
    };

    return (
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle
                sx={{
                    fontSize: '1.5rem',
                    marginBottom: '1px',
                    backgroundImage: 'linear-gradient(to right, #FFA800, #FFD600)',
                    color: 'white'
                }}>차량 예약</DialogTitle>
            <DialogContent
                sx={{
                    marginTop: '15px',
                }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}
                              sx={{
                                  marginTop: '10px',
                              }}>
                            <FormControl fullWidth error={!!errors.rentDay}>
                                <TextField
                                    name="rentDay"
                                    label="대여일"
                                    type="date"
                                    variant="outlined"
                                    value={rentDay}
                                    onChange={handleInputChange(setRentDay)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: today
                                    }}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                        },
                                        '&:hover': {
                                            '& .MuiInputLabel-root': {
                                                color: '#ffb121',
                                            },
                                        },
                                    }}

                                />
                                <FormHelperText>{errors.rentDay}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}
                              sx={{
                                  marginTop: '10px',
                              }}>
                            <FormControl variant="outlined" fullWidth required error={!!errors.rentTime}>
                                <InputLabel>대여 시간</InputLabel>
                                <Select
                                    name="rentTime"
                                    value={rentTime}
                                    onChange={handleInputChange(setRentTime)}
                                    label="대여 시간"
                                    sx={{
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ffb121',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ffb121',
                                        },
                                    }}
                                >
                                    {timeOptions.map((time, index) => (
                                        <MenuItem key={index} value={time} disabled={isTimeBooked(rentDay, time)}>
                                            {time}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.rentTime}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={!!errors.returnDay}>
                                <TextField
                                    name="returnDay"
                                    label="반납일"
                                    type="date"
                                    variant="outlined"
                                    value={returnDay}
                                    onChange={handleInputChange(setReturnDay)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: today
                                    }}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                        },
                                        '&:hover': {
                                            '& .MuiInputLabel-root': {
                                                color: '#ffb121',
                                            },
                                        },
                                    }}

                                />
                                <FormHelperText>{errors.returnDay}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl variant="outlined" fullWidth required error={!!errors.returnTime}>
                                <InputLabel>반납 시간</InputLabel>
                                <Select
                                    name="returnTime"
                                    value={returnTime}
                                    onChange={handleInputChange(setReturnTime)}
                                    label="반납 시간"
                                    sx={{
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ffb121',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ffb121',
                                        },
                                    }}
                                >
                                    {timeOptions.map((time, index) => (
                                        <MenuItem key={index} value={time} disabled={isTimeBookedWithExceptions(returnDay, time)}>
                                            {time}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.returnTime}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.reason}>
                                <TextField
                                    name="reason"
                                    label="예약 사유"
                                    variant="outlined"
                                    value={reason}
                                    onChange={handleInputChange(setReason)}
                                    required
                                    multiline
                                    rows={3}
                                    sx={{
                                        marginTop: '15px',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#ffb121',
                                            },
                                        },
                                        '&:hover': {
                                            '& .MuiInputLabel-root': {
                                                color: '#ffb121',
                                            },
                                        },
                                    }}
                                />
                                <FormHelperText>{errors.reason}</FormHelperText>
                            </FormControl>
                        </Grid>
                        {errors.dateTime && (
                            <Grid item xs={12}>
                                <FormHelperText error>{errors.dateTime}</FormHelperText>
                            </Grid>
                        )}
                    </Grid>
                    <DialogActions
                    sx={{
                        marginRight: '-7px'
                    }}>
                        <Button onClick={handleClose} variant="" color="primary"
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
                                }}>취소</Button>
                        <Button type="submit" variant="" color="primary"
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
                                }}>
                            예약하기
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Carbookingmodal;
