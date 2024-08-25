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
                    <Button onClick={()=> onUpdate(inputValues)} variant="outlined" color="secondary"
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
