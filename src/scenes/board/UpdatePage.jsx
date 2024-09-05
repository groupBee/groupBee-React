import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Checkbox, FormControlLabel, Typography, Link } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// 툴바의 모듈을 설정합니다.
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
];

const UpdatePage = () => {
    const { id, Page } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mustRead, setMustRead] = useState(false);
    const [mustMustRead, setMustMustRead] = useState(false);
    const [files, setFiles] = useState([]);  // 새로 추가된 파일
    const [existingFiles, setExistingFiles] = useState([]);  // 기존 파일 목록
    const [deletedFiles, setDeletedFiles] = useState([]);  // 삭제된 파일 목록
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (Page) {
            setCurrentPage(Page);
        }
    }, [Page]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            const data = response.data;
            setPost(data);
            setTitle(data.title);
            setContent(data.content);
            setMustRead(data.mustRead);
            setMustMustRead(data.mustMustRead);
            if (data.files) {
                setExistingFiles(data.files);  // 기존 파일 목록 가져오기
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const handleMustReadChange = (e) => {
        setMustRead(e.target.checked);
    };

    const handleMustMustReadChange = (e) => {
        setMustMustRead(e.target.checked);
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);  // 새로 추가된 파일들 저장
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

        // 새로 추가된 파일들 추가
        files.forEach((file) => {
            formData.append('files', file);
        });

        // 삭제된 파일 목록 전송
        formData.append('deletedFiles', JSON.stringify(deletedFiles));

        try {
            await axios.patch(`/api/board/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate(`/board/list/${id}/${currentPage}`);  // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error('Error updating post or uploading files:', error);
        }
    };

    const handleCancelClick = () => {
        navigate(`/board/list/${id}/${currentPage}`);
    };

    return (
        <Box m="20px">
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    top: "50%",
                    left: "50%",
                    marginLeft: '15%',
                    height: "auto",
                    minHeight: '850px',
                    width: "80%",
                    maxWidth: "850px",
                    padding: "80px",
                }}
            >
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
                            style={{ width: '100%', maxWidth: '800px', height: '30px' }}
                        />
                    </div>
                    <Box mb={2} mt={2} style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
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
                                    disabled
                                    style={{ marginLeft: '20px' }}
                                />
                            }
                            label="중요"
                        />
                    </Box>
                    <div>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ marginTop: '10px' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="content"></label>
                        <ReactQuill
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            modules={{ toolbar: toolbarOptions }}
                            style={{ width: '100%', maxWidth: '800px', height: '300px', backgroundColor: 'white' }}
                            placeholder='내용을 입력하세요!'
                        />
                    </div>
                    <Box mt={2}>
                        <Button type="submit" variant="contained" style={{
                            marginRight: '20px',
                            marginTop: '80px',
                            color: 'white',
                            backgroundColor: '#f7d774',
                            backgroundImage: 'linear-gradient(135deg, #f7d774 0%, #f1c40f 100%)',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s ease',
                        }}>
                            저장
                        </Button>
                        <Button variant="contained" onClick={handleCancelClick}
                                style={{
                                    color: 'white',
                                    backgroundColor: '#8c8b89',
                                    backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',
                                    marginTop: '80px'
                                }}>
                            취소
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default UpdatePage;
