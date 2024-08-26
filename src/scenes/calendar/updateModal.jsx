import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

const UpdateModal = ({isOpen, onCancel, onUpdate, onDelete, initialData}) => {
    const [inputValues, setInputValues] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        startDay: initialData?.startDay || '',
        endDay: initialData?.endDay || '',
    });

    useEffect(() => {
        if (initialData) {
            setInputValues({
                title: initialData.title || '',
                content: initialData.content || '',
                startDay: initialData.startDay || '',
                endDay: initialData.endDay || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value
        }));

        // 입력 값이 변경될 때 에러 메시지 제거
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value ? '' : prevErrors[name],
        }));
    };

    const  [errors, setErrors] = useState({});

    const errorMessage = () => {
        let tempErrors = {};
        if (!inputValues.title) tempErrors.title = "제목을 입력해 주세요.";
        if (!inputValues.content) tempErrors.content = "내용을 입력해 주세요.";

        setErrors(tempErrors);

        // 에러가 없으면 true, 에러가 있으면 false를 반환합니다.
        return Object.keys(tempErrors).length === 0;
    }

    const handleUpdateClick = () => {
        if (errorMessage()) {
            onUpdate(inputValues); // 유효성 검사 통과 시 업데이트 실행
        }
    };

    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle variant="h3" component="h2"
                         sx={{
                             fontSize: '1.5rem',
                             marginBottom: '1px',
                             backgroundImage: 'linear-gradient(to right, #FFA800, #FFD600)',
                             color: 'white'
                         }}>
                일정 수정
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="제목"
                    name="title"
                    value={inputValues.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
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
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="시작 시간"
                    name="startDay"
                    type="datetime-local"
                    value={inputValues.startDay}
                    onChange={handleChange}
                    InputLabelProps={{shrink: true}}
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
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="끝나는 시간"
                    name="endDay"
                    type="datetime-local"
                    value={inputValues.endDay}
                    onChange={handleChange}
                    InputLabelProps={{shrink: true}}
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
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="내용"
                    name="content"
                    value={inputValues.content}
                    onChange={handleChange}
                    error={!!errors.content}
                    helperText={errors.content}
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
                <DialogActions mt={2}>
                    <Button onClick={handleUpdateClick} variant="outlined" color="secondary"
                            sx={{
                                fontSize: '1rem',
                                color: '#ffb121',
                                backgroundColor: 'white',
                                border: '1px solid #ffb121',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                },
                            }}>수정</Button>
                    <Button onClick={onDelete} variant="outlined" color="secondary"
                            sx={{
                                fontSize: '1rem',
                                color: '#ffb121',
                                backgroundColor: 'white',
                                border: '1px solid #ffb121',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                },
                            }}>삭제</Button>
                    <Button onClick={onCancel} variant="outlined" color="warning" sx={{
                        fontSize: '1rem',
                        color: '#ffb121',
                        backgroundColor: 'white',
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

export default UpdateModal;
