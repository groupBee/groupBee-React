import { useState } from 'react';

const SendEmail = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

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
                alert('Mail sent successfully!');
            } else {
                alert('Failed to send email.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Send Email</h2>
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
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Your message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default SendEmail;
