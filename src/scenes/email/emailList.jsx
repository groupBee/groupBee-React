import { BorderAll } from '@mui/icons-material';
import React, { useState } from 'react';

function EmailList() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');

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

    const showMail=(content)=>{
        
    }
    return (
        <div>
            <h1>Check Email</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={checkEmail}>Check Email</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                

                    <table style={{ border: '1px solid grey' }}> 
                    
                        <tr>
                            <td>번호</td>
                            <td>제목</td>
                            <td>발신자</td>
                            <td>받은 날짜</td>
                        </tr>
                        {emails.map((email, index) => (
                        <>
                        <tr style={{ border: '1px solid grey' }}>
                            <td style={{ border: '1px solid grey' }}>{index+1}</td>
                            <td style={{ border: '1px solid grey' }}><b onClick={showMail(email.content)}>{email.subject}</b></td>
                            <td style={{ border: '1px solid grey' }}>{email.from}</td>
                            <td style={{ border: '1px solid grey' }}>{email.receivedDate}</td>
                        </tr>
                        </>))}
                    </table>
                    {/* // <li key={index}>
                    //     <strong>Subject:</strong> {email.subject}<br />
                    //     <strong>From:</strong> {email.from}<br />
                    //     <strong>Received:</strong> {email.receivedDate}<br />
                    //     <strong>Content:</strong> <div dangerouslySetInnerHTML={{ __html: email.content }} />
                    // </li> */}
            
            </ul>
        </div>
    );
}

export default EmailList;
