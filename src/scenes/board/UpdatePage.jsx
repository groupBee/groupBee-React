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

        // 이미지 크기를 강제로 설정
        const div = document.createElement('div');
        div.innerHTML = value;
        const images = div.querySelectorAll('img');

        // 모든 이미지에 고정된 스타일 적용
        images.forEach(img => {
            img.style.maxWidth = '700px'; // 원하는 고정 크기
            img.style.height = 'auto'; // 비율 유지를 위해 height는 auto
        });

        // 비디오 크기 강제 설정
        const videos = div.querySelectorAll('iframe, video');
        videos.forEach(video => {
            video.style.width = '500px';  // 비디오의 너비를 컨테이너에 맞추기
            video.style.height = '300px'; // 고정된 비디오 높이
        });

        setContent(div.innerHTML); // 수정된 HTML을 다시 저장
    };

    const handleMustReadChange = (e) => {
        setMustRead(e.target.checked);
    };

    const handlemustMustReadChange = (e) => {
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
        <Box sx={{ m: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    minHeight: '850px',
                    width: "80%",
                    maxWidth: "850px",
                    padding: "80px",
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-10px', marginBottom: '30px',
                    fontSize: '25px'}}><h1>게시글 수정</h1></Box>
                <Box height="75vh">
                <form onSubmit={handleSubmit}>
                    <Box>
                        <label htmlFor="title"><b style={{ fontSize: '15px' }}>제목</b></label>
                        <br />
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                height: '30px',
                                border: '0.5px solid grey',
                                marginTop: '10px',
                            }}
                        />
                    </Box>
                    <div style={{ display: 'flex' }}>
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
                                    onChange={handlemustMustReadChange}
                                    style={{ marginLeft: '5px' }}
                                />
                            }
                            label="중요"
                        />
                    </div>
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
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '80px' }}>
                        <Button onClick={handleCancelClick}
                                style={{
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                }}>
                            취소
                        </Button>
                        <Button type="submit" style={{
                            color: 'white',
                            border: 'none',
                            backgroundColor: '#ffb121'
                        }}>
                            저장
                        </Button>
                    </Box>
                </form>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdatePage;
