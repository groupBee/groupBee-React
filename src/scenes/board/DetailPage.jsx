import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Typography, Button} from '@mui/material';


const DetailPage = () => {
    const {id,currentPage} = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [myinfoList, setMyinfoList] = useState([]);
    const [commentList, setCommentList] = useState([]);

    const [comment,setComment] = useState('');

    useEffect(() => {
        getinfo();
    }, []);

    const getinfo = () => {
        axios.get("/api/employee/info")
            .then(res => {
                setMyinfoList(res.data)
                console.log(res.data.potalId);
            })
    }
    const getcomment = () => {
        console.log(id)
        axios.get("/api/comment/list?boardId=" + id)
            .then(res => {
                console.log(res.data)
                setCommentList(res.data)
            })
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            setPost(response.data);
            console.log(response.data)
            getcomment();
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };
    const writeComment =() =>{
        const data={
         "content":comment, "boardId":post.id
        }


        axios.post('/api/comment/insert',data)
            .then(res=>
            {
                alert("댓글이 작성되었습니다")
                getcomment();
                setComment('');
            })

    }

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
    return (
        <Box p={3}>
            {post ? (
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box mb={2} style={{width: '300px'}}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            style={{
                                width: '1000px',
                                whiteSpace: 'normal', // 줄바꿈 자동 적용
                                wordWrap: 'break-word', // 긴 단어의 줄바꿈을 허용
                                padding: '8px'
                            }}
                        >{post.mustRead && <span><b>[공지]&nbsp;</b></span>}
                            <b>{post.title}</b>
                        </Typography>
                    </Box>
                    <Box mb={2} style={{width: '300px'}}>
                        <Typography variant="subtitle1" style={{marginLeft:'800px',width:'400px'}}>
                            작성자: {post.memberId}&nbsp;&nbsp;&nbsp;
                            작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                        </Typography>
                        <Typography style={{marginLeft:'1050px',width:'400px'}}>
                            조회수: {Math.floor(post.readCount / 2)}
                        </Typography>

                    <Box mb={2} style={{width: '300px', display: 'flex', alignItems: 'center'}}>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: '20px',
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '1px solid black',
                                backgroundColor: post.mustRead ? '#171fb3' : 'white'
                            }}/>
                            <b style={{marginLeft: '10px'}}>공지사항</b>
                        </Box>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '1px solid black',
                                backgroundColor: post.mustMustRead ? 'red' : 'white'
                            }}/>
                            <b style={{marginLeft: '10px'}}>중요</b>
                        </Box>

                    </Box>
                    </Box>
                    <Box mb={2} style={{ width: '300px' }}>
                        <Typography variant="body1" paragraph>
                            <div
                                style={{
                                    minWidth: '1100px',
                                    minHeight: '500px',
                                    border: '1px solid black',
                                    backgroundColor: 'white',
                                    whiteSpace: 'pre-wrap', // 공백과 줄바꿈을 유지
                                    padding: '8px',
                                    fontSize:'15px'
                                }}>
                                {post.content}
                            </div>
                        </Typography>
                    </Box>
                    {post.file && (
                        <Box mb={2} style={{width: '300px'}}>
                            {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                                <img src={`/uploads/${post.file}`} alt="첨부파일" style={{maxWidth: '100%'}}/>
                            ) : (
                                <a href={`/uploads/${post.file}`} download>
                                    첨부파일 다운로드
                                </a>
                            )}
                        </Box>
                    )}


                    <Box mt={2} style={{width: '300px'}}>
                        {
                            myinfoList.potalId == post.memberId ?
                                <>
                                    <Button variant="contained" onClick={handleEditClick}
                                            style={{marginRight: '10px',color:'white', backgroundColor:'#3af0b6'}}>
                                        수정
                                    </Button>
                                    <Button variant="contained"  onClick={handleDeleteClick}
                                            style={{marginRight: '10px',color:'white', backgroundColor:'#fc9a38'}}>
                                        삭제
                                    </Button> </> : ''}
                        <Button variant="contained" style={{color:'white', backgroundColor:'#8c8b89'}} onClick={handleBackClick}>
                            목록
                        </Button>
                    </Box>
                    <hr/>
                    <div>
                        댓글
                    </div>
                    <div>
                        <textarea style={{width:'1080px',height:'100px'}} value={comment} onChange={(e) => setComment(e.target.value)}>
                        </textarea>
                        <Button onClick={writeComment} variant='contained' color='info' style={{marginLeft:'20px',marginBottom:'20px'}}>댓글작성</Button>
                    </div><br/>

                    <table>
                        <tbody>
                        <tr>
                            <th><p  style={{width: '100px'}}>작성자</p></th>
                            <th><p  style={{minWidth:'400px',marginLeft:'20px',marginRight:'200px'}}>내용</p></th>
                            <th><p  style={{marginLeft:'280px',width: '100px'}}>작성일</p></th>
                        </tr>
                        </tbody>
                    </table>
                    {
                        commentList &&
                        commentList.map((item, idx) =>
                            <table>
                                <tbody>
                                <tr>
                                    <td style={{fontSize:'15px'}}>{item.memberId}</td>
                                    <td style={{marginRight:'200px',minWidth:'350px',fontSize:'15px'}}><p  style={{
                                        width: '850px',
                                        whiteSpace: 'normal', // 줄바꿈 자동 적용
                                        wordWrap: 'break-word', // 긴 단어의 줄바꿈을 허용
                                        padding: '8px',
                                        marginTop:'5px',
                                        paddingTop:'15px',
                                        marginLeft:'50px'
                                    }}>{item.content}</p></td>
                                    <td>     {new Date(item.createDate).getFullYear()}-{String(new Date(item.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(item.createDate).getDate()).padStart(2, '0')} &nbsp;
                                        {new Date(item.createDate).toLocaleTimeString('ko-KR', {
                                            timeZone: 'Asia/Seoul',
                                            hour12: false,  // 24시간 형식으로 설정
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}</td>
                                    {
                                        myinfoList.potalId == item.memberId ?
                                            <>
                                                <Button variant="contained" color="error"
                                                        style={{marginRight: '10px',marginLeft:'20px',marginTop:'20px'}}
                                                        onClick={(e) => commentDeleteClick(item.id)}
                                                >
                                                    삭제
                                                </Button> </> : ''}

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
    );
};

export default DetailPage;
