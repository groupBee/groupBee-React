import { useState } from 'react';

const SendEmail = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        const emailData = {
            username,
            password,
            to,
            subject,
            body,
        };

        try {
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (response.ok) {
                alert('메일이 성공적으로 전송되었습니다!');
                window.location.reload();
            } else {
                alert('전송실패!');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email: ' + error.message);
        }
    };

    return (
        <div>
            <h2 style={{marginTop:'20px'}}>메일 보내기</h2>
            <form onSubmit={handleSendEmail}>
                <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your email password"
                />
                <hr/>
                <b>받는사람</b><input style={{width:'700px',marginLeft:'35px'}}
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="메일주소"
                /><br/>
                <b>참조</b><input style={{width: '700px', marginLeft: '60px', marginTop: '10px'}}
                         type="text"
                         value={to}
                         onChange={(e) => setTo(e.target.value)}
                         placeholder="참조주소"
            />
                <br/>
                <b>제목</b><input style={{width: '700px', marginLeft: '60px', marginTop: '10px'}}
                         type="text"
                         value={subject}
                         onChange={(e) => setSubject(e.target.value)}
                         placeholder="Subject"
                />
                <br/><p style={{marginTop:'10px'}}><b style={{marginTop:'10px'}}>내용</b></p>
                <textarea style={{width:'700px',height:'400px',marginLeft:'82px',marginTop:'-20px'}}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Your message"
                /><br/>

                <button type="submit" style={{marginLeft:'730px',width:'50px',height:'30px'}}>Send</button>
            </form>
        </div>
    );
};

export default SendEmail;
