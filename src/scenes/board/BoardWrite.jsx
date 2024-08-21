import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components";
import axios from 'axios';

const BoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('file', file);

        try {
            axios.post('/api/notice-boards', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/board');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <Header title="사원 게시판" />
            <h2>글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="file">파일:</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">저장</button>
            </form>
        </div>
    );
};

export default BoardWrite;
