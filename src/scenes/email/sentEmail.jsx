import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailOpenIcon from '@mui/icons-material/Drafts';
const SentEmail=()=>{


        const [emails, setEmails] = useState([]);
        const [error, setError] = useState('');
        const [selectedEmail, setSelectedEmail] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [readEmails, setReadEmails] = useState([]);
        const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
        const emailsPerPage = 15; // 페이지당 15개의 이메일을 표시
        const [pageGroup, setPageGroup] = useState(0); // 페이지 그룹 관리
        const pagesPerGroup = 5; // 그룹당 페이지 수를 5로 설정
    
      
    
        // 이메일 목록을 가져오는 함수
        const checkEmail = async () => {
    
            try {
                const response = await fetch('/api/email/sent', {
                    method: 'get'
                });
    
                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    // 이메일 목록을 최신순으로 정렬
                    result.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));
                    setEmails(result);
                    setError('');
                } else {
                    const result = await response.json();
                    setError(result.error || '이메일과 비밀번호를 확인해주세요');
                }
            } catch (err) {
                setError('에러: ' + err.message);
            }
        };
    
        // 특정 이메일 내용을 보여주는 함수
        const showMail = (content) => {
            alert(content)
            setSelectedEmail(content);
            setShowModal(true);
        };
    
        // 모달 닫기
        const closeModal = () => {
            setShowModal(false);
        };
    
        // 페이지 이동 함수
        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
        };
    
        // 페이지 그룹 이동 함수
        const nextPageGroup = () => {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * pagesPerGroup + pagesPerGroup + 1); // 다음 그룹의 첫 페이지
        };
    
        const prevPageGroup = () => {
            if (pageGroup > 0) {
                setPageGroup(pageGroup - 1);
                setCurrentPage(pageGroup * pagesPerGroup); // 이전 그룹의 마지막 페이지
            }
        };
    

    
    
        // 현재 페이지에 보여줄 이메일 목록 슬라이싱
        const indexOfLastEmail = currentPage * emailsPerPage;
        const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
        const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);
    
        // 총 페이지 수 계산
        const totalPages = Math.ceil(emails.length / emailsPerPage);
    
        // 현재 그룹의 페이지 버튼 생성
        const pageButtons = Array.from(
            { length: Math.min(pagesPerGroup, totalPages - pageGroup * pagesPerGroup) },
            (_, i) => pageGroup * pagesPerGroup + i + 1
        );
    
    
        // 유저 이름이 설정된 후 이메일 체크
        useEffect(() => {
    
                checkEmail();
            },[]);
    
        return (
            <div>
                <h2 style={{ marginTop: '20px', textAlign: 'center' }}>보낸 메일함</h2>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', backgroundColor: 'white', height: '700px' }}>
                    <ul>
                        <table style={{ border: '1px solid #ddd', width: '1000px', marginTop: '30px', marginLeft: '-30px', borderCollapse: 'collapse', borderLeft: 'none', borderRight: 'none' }}>
                            <thead>
                            <tr style={{ borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #ddd' }}>
                                <th style={{ width: '100px', textAlign: 'center', borderBottom: '1px solid #ddd', height: '50px' }}>읽음</th>
                                <th style={{ width: '500px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>&nbsp;&nbsp;제목</th>
                                <th style={{ width: '200px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>발신자</th>
                                <th style={{ width: '200px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>받은 날짜</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentEmails.map((email, index) => (
                                <tr key={index} style={{ borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #ddd' }}>
                                    <td style={{ textAlign: 'center', borderBottom: '1px solid #ddd', height: '40px' }}>
                                        {readEmails[index] ? <MailOpenIcon /> : <MailOutlineIcon />}
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: '1px solid #ddd',
                                            fontWeight: readEmails[index] ? 'normal' : 'bold' // 읽음 상태에 따라 글씨 굵기 변경
                                        }}
                                    >
                                        <p style={{ marginLeft: '30px' }}
                                           onClick={() => {
                                               showMail(email.content);
                                           }}>&nbsp;&nbsp;{email.subject}</p>
                                    </td>
                                    <td style={{ textAlign: 'center', borderBottom: '1px solid #ddd',
                                        fontWeight: readEmails[index] ? 'normal' : 'bold'}}>{email.from}</td>
                                    <td style={{ textAlign: 'right', borderBottom: '1px solid #ddd',
                                        fontWeight: readEmails[index] ? 'normal' : 'bold'}}>{email.receivedDate}</td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                    </ul>
                   
                </div>
    
                {/* 페이지네이션 버튼 */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    {pageGroup > 0 && (
                        <button
                            onClick={prevPageGroup}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#ddd',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {"<"}
                        </button>
                    )}
    
                    {pageButtons.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: currentPage === page ? '#4CAF50' : '#ddd',
                                color: currentPage === page ? 'white' : 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {page}
                        </button>
                    ))}
    
                    {pageGroup * pagesPerGroup + pagesPerGroup < totalPages && (
                        <button
                            onClick={nextPageGroup}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#ddd',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {">"}
                        </button>
                    )}
                </div>
    
            
            </div>
        );
    }

export default SentEmail;