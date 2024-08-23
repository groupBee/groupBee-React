import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EmailList() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('p@ssw0rd');
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 로그인한 사람의 이메일 정보를 가져오는 함수
    const getinfo = () => {
        axios.get("/api/employee/info")
            .then(res => {
                setUsername(res.data.data.email);
                
            })
            .catch(err => {
                setError('정보를 가져오는 데 실패했습니다: ' + err.message);
            });
    };

    // 이메일 목록을 가져오는 함수
    const checkEmail = async () => {

        console.log(username,password)

        try {
            const response = await fetch('/api/email/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result)
                setEmails(result);
                setError('');
            } else {
                const result = await response.json();
                setError(result.error || '이메일과 비밀번호를 확인해주세요');
            }
        } catch (err) {

            setError('에러: ' + err.message);
        }

        console.log("d")
    };

    // 특정 이메일 내용을 보여주는 함수
    const showMail = (content) => {
        setSelectedEmail(content);
    };

    // 모달 열기
    const openModal = () => {
        setShowModal(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // 컴포넌트가 처음 렌더링될 때 유저 정보 가져오기
    useEffect(() => {
        getinfo();
    }, []);

    // 유저 이름이 설정된 후 이메일 체크
    useEffect(() => {
        if (username) {
            checkEmail();
        }
    }, [username]);

    return (
        <div>
            <h2 style={{ marginTop: '20px' }}>받은 메일함</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                <table style={{ border: '1px solid grey', width: '900px', marginTop: '30px', marginLeft: '-30px' }}>
                    <tr style={{ border: '1px solid grey' }}>
                        <td style={{ border: '1px solid grey', width: '30px' }}>번호</td>
                        <td style={{ border: '1px solid grey' }}>&nbsp;&nbsp;제목</td>
                        <td style={{ border: '1px solid grey' }}>발신자</td>
                        <td style={{ border: '1px solid grey' }}>받은 날짜</td>
                    </tr>
                    {emails.map((email, index) => (
                        <tr key={index} style={{ border: '1px solid grey' }}>
                            <td style={{ border: '1px solid grey', textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ border: '1px solid grey' }}>
                                <p onClick={() => {
                                    showMail(email.content);
                                    openModal();
                                }}>&nbsp;&nbsp;{email.subject}</p>
                            </td>
                            <td style={{ border: '1px solid grey' }}>{email.To}</td>
                            <td style={{ border: '1px solid grey' }}>{email.receivedDate}</td>
                        </tr>
                    ))}
                </table>
            </ul>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>Email Content</h3>
                        <div dangerouslySetInnerHTML={{ __html: selectedEmail }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailList;
