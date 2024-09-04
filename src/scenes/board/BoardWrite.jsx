import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components";
import axios from 'axios';
import { Box, Button, Chip } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Board.css';

// 툴바의 모듈을 설정합니다.
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
];

const BoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [readCount, setReadCount] = useState(0);
    const [mustRead, setMustRead] = useState(false);
    const [mustMustRead, setMustMustRead] = useState(false);
    const [file, setFile] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');
    const [mustMustReadCount, setMustMustReadCount] = useState(0);

    useEffect(() => {
        // 게시물 리스트를 가져와서 mustMustRead 게시글 수를 계산합니다.
        const fetchMustMustReadCount = async () => {
            try {
                const response = await axios.get('/api/board/list');
                const posts = response.data; // Array of posts
                const count = posts.filter(p => p.board.mustMustRead).length;
                setMustMustReadCount(count);
            } catch (error) {
                console.error('Error fetching mustMustRead count:', error);
            }
        };

        fetchMustMustReadCount();
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        console.log('Content updated:', value); // 디버깅을 위한 로그
        setContent(value);
    };

    const handleMustReadChange = (e) => {
        setMustRead(e.target.checked);
    };

    const handleMustMustReadChange = (e) => {
        if (!e.target.checked && mustMustReadCount >= 8) {
            alert('중요 게시글은 8개까지만 설정할 수 있습니다.');
            return;
        }
        setMustMustRead(e.target.checked);
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setOriginalFileName(acceptedFiles[0].name);
        }
    };

    const handleBackClick = () => {
        navigate(`/board`);
    };

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    const DeleteAttachment = () => {
        setFile(null);
        setOriginalFileName('');
    };

    const FileAttachClick = (event) => {
        event.preventDefault();
        open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardData = {
            title,
            content,
            mustRead,
            mustMustRead,
            readCount,
        };

        const formData = new FormData();
        formData.append('boardData', JSON.stringify(boardData));

        if (file) {
            formData.append('file', file);
            formData.append('originalFileName', originalFileName);
        }

        try {
            await axios.post('/api/board/insert', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/board');
        } catch (error) {
            console.error('Error creating post or uploading file:', error);
        }
    };

    return (
        <Box m="20px">
            <Header title="게시글 작성" />
            <Box height="75vh">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title"><b style={{ fontSize: '15px' }}>제목</b></label>
                            <br/>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                style={{ width: '800px', height: '30px' }}
                            />
                        </div>
                        <div style={{display: 'flex'}}>
                            <input
                                type="checkbox"
                                checked={mustRead}
                                onChange={handleMustReadChange}
                            /><b style={{marginTop: '15px', marginLeft: '10px'}}>공지사항</b>

                            <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                                <input
                                    type="checkbox"
                                    checked={mustMustRead}
                                    onChange={handleMustMustReadChange}
                                    disabled={mustMustReadCount >= 8 && !mustMustRead}
                                />
                                <b style={{marginTop:'2px', marginLeft: '10px',fontSize:'15px'}}>중요</b>
                                {mustMustReadCount >= 8 && !mustMustRead && (
                                    <span style={{color: 'red', marginLeft: '10px',fontSize:'12px'}}>
                                        중요게시글이 8개를 넘을 수 없습니다.
                                    </span>
                                )}
                            </div>
                        </div>
                        <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            <b style={{width: '65px', textAlign: 'center'}}>첨부파일</b>
                            <button
                                onClick={FileAttachClick}
                                style={{
                                    marginLeft: '20px',
                                    border: '1px solid #dddd',
                                    backgroundColor: 'transparent',
                                    borderRadius: '4px',
                                    padding: '3px 6px'
                                }}
                            >
                                파일첨부하기
                            </button>
                            {file && (
                                <button
                                    onClick={DeleteAttachment}
                                    style={{
                                        marginLeft: '10px',
                                        border: '1px solid #dddd',
                                        backgroundColor: 'transparent',
                                        borderRadius: '4px',
                                        padding: '3px 6px'
                                    }}
                                >
                                    삭제
                                </button>
                            )}
                        </Box>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #dddddd',
                                borderRadius: '4px',
                                padding: '20px',
                                textAlign: 'center',
                                backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                                marginBottom: '20px',
                                width: '800px',
                                height: '100px'
                            }}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <Chip
                                    label={originalFileName}
                                    onDelete={DeleteAttachment}
                                    sx={{
                                        maxWidth: '200px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden'
                                    }}
                                />
                            ) : (
                                <>
                                    <UploadFileIcon style={{ color: 'gray', marginBottom: '5px' }}/>
                                    <p style={{ color: 'gray' }}>파일을 여기에 드래그하여 파일을 선택하세요.</p>
                                </>
                            )}
                        </Box>
                        <div style={{ marginTop: '-20px' }}>
                            <label htmlFor="content"></label>
                            <ReactQuill
                                id="content"
                                theme="snow"
                                value={content}
                                onChange={handleContentChange}
                                modules={{ toolbar: toolbarOptions }}
                                style={{ width: '800px', height: '400px', backgroundColor: 'white' }}
                                placeholder='내용을 입력하세요!'
                            />
                        </div>

                        <Button
                            type="submit"
                            variant='contained'
                            style={{
                                color: 'white',
                                backgroundColor: '#36c3ff',
                                backgroundImage: 'linear-gradient(135deg, #36c3ff 0%, #74d2ff 100%)',
                                border: 'none',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                marginTop: '80px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#74d2ff';
                                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#36c3ff';
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            등록
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                color: 'white',
                                backgroundColor: '#8c8b89',
                                backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)',
                                border: 'none',
                                marginTop: '80px',
                                marginLeft: '20px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'background-color 0.3s ease'
                            }}
                            onClick={handleBackClick}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#2bb48c';
                                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#3af0b6';
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            목록
                        </Button>
                    </form>
                </div>
            </Box>
        </Box>
    );
};

export default BoardWrite;
