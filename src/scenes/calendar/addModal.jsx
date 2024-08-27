import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const addModal = ({isOpen, onCancel, onSubmit, inputValues, setInputValues}) => {
    useEffect(() => {
        //console.log("Current Input Values:", inputValues);
    }, [inputValues]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value
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
                {inputValues && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="제목"
                        name="title"
                        value={inputValues.title || ''}
                        onChange={handleChange}
                        required
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
                    />)}
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="시작 시간"
                    name="startDay"
                    type="datetime-local"
                    value={inputValues.startDay || ''}
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
                    name="endDay"
                    type="datetime-local"
                    value={inputValues.endDay || ''}
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
                {inputValues && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="내용"
                        name="content"
                        value={inputValues.content || ''}
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
                    />)}

                <DialogActions mt={2}
                               sx={{
                                   marginRight: '-7px'
                               }}>
                    <Button onClick={() => {
                        if (errorMessage()) {
                            onSubmit();
                        }
                    }} variant="outlined" color="secondary"
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
                                    border: '1px solid #ffb121',
                                },
                            }}>취소</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default addModal;
