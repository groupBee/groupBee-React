import React, { useEffect } from 'react';
import {Dialog, DialogTitle, DialogContent,DialogActions, Box, Button, Modal, TextField, Typography} from "@mui/material";

const addModal = ({isOpen, onCancel, onSubmit, inputValues, setInputValues}) => {

    useEffect(() => {
        console.log("Current Input Values:", inputValues);
    }, [inputValues]);

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
                    일정 추가
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
                    name="start"
                    type="datetime-local"
                    value={inputValues.start}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
                    name="end"
                    type="datetime-local"
                    value={inputValues.end}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
                    name="description"
                    value={inputValues.description}
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
                    <Button onClick={onSubmit} variant="outlined" color="secondary"
                            sx={{
                                fontSize: '1rem',
                                color: '#ffb121',
                                backgroundColor: 'white',
                                border: '1px solid #ffb121',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',},
                            }}>추가</Button>

                    <Button onClick={onCancel} variant="outlined" color="secondary"
                            sx={{
                                fontSize: '1rem',
                                color: '#ffb121',
                                backgroundColor: 'white',
                                border: '1px solid #ffb121',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',},
                            }}>취소</Button>
                </DialogActions>
        </DialogContent>
        </Dialog>
    );
};

export default addModal;
