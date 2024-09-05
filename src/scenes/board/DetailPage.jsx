import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit'; // 수정 아이콘 추가

const DetailPage = () => {
    const { id, currentPage } = useParams();
    const [post, setPost] = useState(null);
    const [myinfoList, setMyinfoList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null); // 댓글 수정 ID 상태
    const [editedComment, setEditedComment] = useState(''); // 수정된 댓글 내용 상태
    const navigate = useNavigate();

    useEffect(() => {
        getinfo();
    }, []);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const getinfo = () => {
        axios.get("/api/employee/info")
            .then(res => {
                setMyinfoList(res.data);
                console.log(res.data.potalId);
            });
    };

    const getcomment = () => {
        console.log(id);
        axios.get("/api/comment/list?boardId=" + id)
            .then(res => {
                console.log(res.data);
                setCommentList(res.data);
            });
    };

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            setPost(response.data);
            console.log(response.data);
            getcomment();
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const writeComment = () => {
        if (!comment) {
            alert("댓글을 입력하세요");
            return;
        }

        const data = {
            "content": comment,
            "boardId": post.id
        };

        axios.post('/api/comment/insert', data)
            .then(res => {
                alert("댓글이 작성되었습니다");
                getcomment();
                setComment('');
            })
            .catch(error => {
                console.error('Error posting comment:', error);
                alert('댓글 작성 중 오류가 발생했습니다.');
            });
    };

    const handleEditClick = () => {
        navigate(`/board/update/${id}`);
    };

    const handleDeleteClick = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            axios.delete(`/api/board/delete/${id}`)
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                });
        }
    };

    const handleBackClick = () => {
        navigate(`/board/${currentPage}`);
    };

    const commentDeleteClick = (commentId) => {
        const isConfirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');

        if (isConfirmed) {
            axios.delete(`/api/comment/delete/${commentId}`)
                .then(() => {
                    alert("댓글이 삭제되었습니다");
                    getcomment();
                })
                .catch(error => {
                    console.error('Error deleting comment:', error);
                    alert('댓글 삭제 중 오류가 발생했습니다.');
                });
        }
    };

    const handleEditCommentClick = (commentId, content) => {
        setEditCommentId(commentId);
        setEditedComment(content);
    };

    const handleEditCommentSave = () => {
        if (!editedComment) {
            alert("수정된 댓글을 입력하세요");
            return;
        }

        // 댓글을 삭제한 후 수정된 댓글을 추가하는 방식
        const deletePromise = axios.delete(`/api/comment/delete/${editCommentId}`);
        const insertPromise = deletePromise.then(() => {
            const data = {
                "content": editedComment,
                "boardId": post.id
            };
            return axios.post('/api/comment/insert', data);
        });

        insertPromise
            .then(() => {
                alert("댓글이 수정되었습니다");
                getcomment();
                setEditCommentId(null);
                setEditedComment('');
            })
            .catch(error => {
                console.error('Error updating comment:', error);
                alert('댓글 수정 중 오류가 발생했습니다.');
            });
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <Box m="20px">
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
        <Box p={3}>
            {post ? (
                <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ backgroundColor: 'white', maxWidth: '1155px', marginLeft: '-24px', paddingLeft: '6%' }}>
                    <Box mb={2} style={{width: '300px'}}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            style={{
                                width: '1100px',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                padding: '3px',
                                marginTop: '20px',
                                borderBottom: '1px solid grey',
                                borderTop: '1px solid grey',
                                backgroundColor: 'white'
                            }}
                        >
                            {post.mustRead && <span><b style={{fontSize: '20px'}}>[공지]&nbsp;</b></span>}
                            <b style={{fontSize: '20px'}}>{post.title}</b>
                        </Typography>
                        <Typography variant="subtitle1" style={{width: '400px', paddingLeft: '5px', marginTop: '-3px'}}>
                            작성자: {post.writer}&nbsp;&nbsp;&nbsp;
                        </Typography>
                    </Box>
                    <Box mb={2} style={{width: '300px', marginTop: '-50px'}}>
                        <Typography variant="subtitle1"
                                    style={{marginLeft: '910px', width: '400px', marginTop: '-20px'}}>
                            작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                        </Typography>

                        {post.updateDate && new Date(post.updateDate) > new Date(post.createDate) && (
                            <Typography variant="subtitle1"
                                        style={{marginLeft: '910px', width: '400px', marginTop: '5px'}}>
                                수정일: {new Date(post.updateDate).toLocaleString('ko-KR')}
                            </Typography>
                        )}
                        <Typography style={{ marginLeft: '1035px', width: '400px', paddingTop: '10px' }}>
                            조회수: {Math.floor(post.readCount / 2)}
                        </Typography>

                        <Box mb={2} style={{ width: '300px', display: 'flex', alignItems: 'center' }}>
                            {/*<Box*/}
                            {/*    style={{*/}
                            {/*        display: 'flex',*/}
                            {/*        alignItems: 'center',*/}
                            {/*        marginRight: '20px',*/}
                            {/*        visibility: 'hidden'*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <div style={{*/}
                            {/*        width: '16px',*/}
                            {/*        height: '16px',*/}
                            {/*        border: '1px solid black',*/}
                            {/*        marginLeft: '10px',*/}
                            {/*        backgroundColor: post.mustRead ? '#171fb3' : 'white'*/}
                            {/*    }} />*/}
                            {/*    <b style={{ marginLeft: '10px' }}>공지사항</b>*/}
                            {/*</Box>*/}
                            {/*<Box*/}
                            {/*    style={{*/}
                            {/*        display: 'flex',*/}
                            {/*        alignItems: 'center',*/}
                            {/*        visibility: 'hidden'*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <div style={{*/}
                            {/*        width: '16px',*/}
                            {/*        height: '16px',*/}
                            {/*        border: '1px solid black',*/}
                            {/*        backgroundColor: post.mustMustRead ? 'red' : 'white'*/}
                            {/*    }} />*/}
                            {/*    <b style={{ marginLeft: '10px' }}>중요</b>*/}
                            {/*</Box>*/}
                            <Box mb={2} style={{ width: '300px' }}>
                                {post.file && post.originalFileName && (
                                    <Box style={{borderTop:'1px solid grey',borderBottom:'1px solid grey',width:'1100px',paddingBottomBottom:'-10px'}}>
                                        <Typography variant="body1" style={{ marginBottom: '10px', fontSize: '15px' }}>
                                            첨부파일:&nbsp;&nbsp;&nbsp;
                                            <Button
                                                onClick={() => downloadFile(`https://minio.bmops.kro.kr/groupbee/board/${post.file}`, post.originalFileName)}
                                                style={{
                                                    color: '#1e90ff',
                                                    textDecoration: 'none',
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    padding: '0',
                                                    cursor: 'pointer',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {post.originalFileName}
                                            </Button>
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Box mb={2} style={{ width: '69%' }}>
                        <Typography
                            variant="body1"
                            paragraph
                            style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#444'
                            }}
                        >
                            <div
                                style={{
                                    width: '1100px',
                                    minHeight: '300px',
                                    marginTop: '-30px',
                                    border: '1px solid black',
                                    borderRadius: '8px',
                                    backgroundColor: '#fafafa',
                                    padding: '16px',
                                    fontSize: '15px',
                                    overflow: 'auto'
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </Typography>
                    </Box>


                    <Box mt={2} style={{ width: '300px',marginTop:'-30px',marginLeft:'1000px' }}>
                        {
                            myinfoList.potalId === post.memberId ?
                                <>
                                    &nbsp;&nbsp;&nbsp;                <Button
                                        onClick={handleEditClick}
                                        style={{marginRight:'-30px'}}
                                    >
                                        수정
                                    </Button>
                                    <Button onClick={handleDeleteClick}
                                            style={{marginRight:'-30px'}}
                                    >
                                        삭제
                                    </Button><br/>
                                </> : ''
                        }
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <Button variant="contained" style={{
                            color: 'white',
                            backgroundColor: '#8c8b89',
                            backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s ease',
                        }} onClick={handleBackClick}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2bb48c';
                                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3af0b6';
                                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}>
                            목록
                        </Button>
                    </Box>
                    <hr />
                    <div style={{marginTop:'30px'}}>
                        <b>댓글</b><br />
                    </div>
                    <div>
                        <textarea style={{ width: '1100px', height: '100px', borderRadius: '10px' }} value={comment} onChange={(e) => setComment(e.target.value)}>
                        </textarea>
                        <Button
                            onClick={writeComment}
                            variant='contained'
                            style={{
                                float: 'right',
                                marginBottom: '20px',
                                color: 'black',
                                border: '1px solid grey',
                                backgroundColor: '#e1e1f5',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            등록
                        </Button>
                    </div><br />

                    <table>
                        <tbody>
                        <tr>
                            <th><p style={{ width: '100px' }}>작성자</p></th>
                            <th><p style={{ minWidth: '400px', marginLeft: '20px', marginRight: '200px' }}>내용</p></th>
                            <th><p style={{ marginLeft: '180px', width: '100px' }}>작성일</p></th>
                        </tr>
                        </tbody>
                    </table>
                    {
                        commentList &&
                        commentList.map((item, idx) =>
                            <table key={item.id}>
                                <tbody>
                                <tr style={{ borderBottom: '0.5px solid grey', maxHeight: '100px' }}>
                                    <td style={{ fontSize: '15px', minWidth: '55px', maxHeight: '50px' }}>{item.writer}</td>
                                    <td style={{ marginRight: '200px', minWidth: '350px', fontSize: '15px', maxHeight: '50px' }}>
                                        {editCommentId === item.id ? (
                                            <div>
                                                    <textarea
                                                        value={editedComment}
                                                        onChange={(e) => setEditedComment(e.target.value)}
                                                        style={{ width: '700px', padding: '8px', borderRadius: '8px' }}
                                                    />
                                                <Button onClick={handleEditCommentSave} variant='contained' style={{ marginLeft: '10px' }}>
                                                    저장
                                                </Button>
                                                <Button onClick={() => setEditCommentId(null)} variant='contained' style={{ marginLeft: '10px' }}>
                                                    취소
                                                </Button>
                                            </div>
                                        ) : (
                                            <p style={{
                                                width: '700px',
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                                padding: '8px',
                                                marginTop: '5px',
                                                paddingTop: '15px',
                                                marginLeft: '55px',
                                                marginRight: '50px'
                                            }}>{item.content}</p>
                                        )}
                                    </td>
                                    <td style={{ width: '200px', maxHeight: '50px' }}>
                                        {new Date(item.createDate).getFullYear()}-{String(new Date(item.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(item.createDate).getDate()).padStart(2, '0')} &nbsp;
                                        {new Date(item.createDate).toLocaleTimeString('ko-KR', {
                                            timeZone: 'Asia/Seoul',
                                            hour12: false,
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </td>
                                    {
                                        myinfoList.potalId === item.memberId ?
                                            <><div style={{display:'flex',paddingTop:'15px'}}>
                                                <Button
                                                    style={{width:'30px'}}
                                                    onClick={() => handleEditCommentClick(item.id, item.content)}
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    style={{width:'30px' }}
                                                    onClick={() => commentDeleteClick(item.id)}
                                                >
                                                    <CloseIcon />
                                                </Button>
                                            </div>

                                            </> : ''
                                    }
                                </tr>
                                </tbody>
                            </table>
                        )
                    }
                </Box>

            ) : (
                <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>
            )}
        </Box>
        </Box>
        </Box>
    );
};

export default DetailPage;
