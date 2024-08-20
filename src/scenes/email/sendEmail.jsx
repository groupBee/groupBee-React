import { useState } from 'react';
import Email from './smtp.js'

    const SendEmail = () => {
        const [to, setTo] = useState('');
        const [subject, setSubject] = useState('');
        const [message, setMessage] = useState('');
        const [from, setFrom] = useState('');
        const [password, setPassword] = useState('');
    
        const handleSendEmail = (e) => {
            e.preventDefault();
    
            Email.send({
                Host: '100.64.0.9', // 여기에 Mailcow SMTP 서버 주소를 입력
                Username: from,              // 발신자의 이메일 주소
                Password: password,          // 발신자의 이메일 비밀번호
                To: to,                      // 수신자의 이메일 주소
                From: from,                  // 발신자의 이메일 주소
                Subject: subject,            // 이메일 제목
                Body: message,               // 이메일 본문
            })
            .then((message) => alert('Mail sent successfully!'))
              .catch((err) => alert('Failed to send email: ' + err));
        };
    
        return (
            <div>
                <h2>Send Email</h2>
                <form onSubmit={handleSendEmail}>
                    <input
                        type="email"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Your email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your email password"
                    />
                    <input
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Recipient's email"
                    />
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                    />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your message"
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    };
    
    export default SendEmail;
    