import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const UpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mustRead, setMustRead] = useState(false);
    const [mustMustRead, setMustMustRead] = useState(false);
    const [file, setFile] = useState(null);
    const {Page}=useParams();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(()=>{
        if(Page){
            setCurrentPage(Page)}

    },[])

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            const data = response.data;
            setPost(data);
            setTitle(data.title);
            setContent(data.content);
            setMustRead(data.mustRead);
            setMustMustRead(data.mustMustRead);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleMustReadChange = (e) => {
        setMustRead(e.target.checked);
    };

    const handleMustMustReadChange = (e) => {
        setMustMustRead(e.target.checked);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardData = {
            title,
            content,
            mustRead,
            mustMustRead,
        };

        const formData = new FormData();
        formData.append('boardData', JSON.stringify(boardData));

        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.patch(`/api/board/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate(`/board/list/${id}/${currentPage}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error('Error updating post or uploading file:', error);
        }
    };

    const handleCancelClick = () => {
        navigate(`/board/list/${id}/${currentPage}`);
    };

    return (
        <Box m="20px">
            <Box height="75vh">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title"><b style={{ fontSize: '15px' }}>제목</b></label>
                        <br />
                        <TextField
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    <Box mb={2} mt={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustRead}
                                    onChange={handleMustReadChange}
                                />
                            }
                            label="공지사항"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustMustRead}
                                    onChange={handleMustMustReadChange}
                                    style={{ marginLeft: '20px' }}
                                />
                            }
                            label="중요"
                        />
                    </Box>
                    <div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="content"></label>
                        <TextField
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            required
                            multiline
                            rows={10}
                            fullWidth
                            variant="outlined"
                            placeholder="내용을 입력하세요"
                        />
                    </div>
                    <Box mt={2}>
                        <Button type="submit" variant='contained' color='primary' style={{ marginRight: '10px' }}>
                            저장
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleCancelClick}>
                            취소
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default UpdatePage;
