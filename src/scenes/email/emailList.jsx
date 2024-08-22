import { BorderAll } from '@mui/icons-material';
import React, { useState } from 'react';

function EmailList() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const checkEmail = async () => {
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

    const showMail = (content) => {
        setSelectedEmail(content);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h2 style={{ marginTop: '20px' }}>받은 메일함</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
            />&nbsp; &nbsp;&nbsp;
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={checkEmail} style={{ marginLeft: '30px' }}>Check Email</button>
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
                        <>
                            <tr style={{ border: '1px solid grey' }}>
                                <td style={{ border: '1px solid grey', textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ border: '1px solid grey' }}>
                                    <p onClick={() => {
                                        showMail(email.content);
                                        openModal();
                                    }}>&nbsp;&nbsp;{email.subject}</p>
                                </td>
                                <td style={{ border: '1px solid grey' }}>{email.from}</td>
                                <td style={{ border: '1px solid grey' }}>{email.receivedDate}</td>
                            </tr>
                        </>
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
