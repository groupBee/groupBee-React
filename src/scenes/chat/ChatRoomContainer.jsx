import { useEffect, useState, useRef } from 'react';
import Stomp from 'stompjs';
import './ChatRoomContainer.css';
import axios from 'axios';

const ChatRoomContainer = ({ activeRoom, onClose, userId, name, chatRoomId, topic }) => {
    const [messages, setMessages] = useState([]);  // 모든 메시지를 저장할 배열
    const [inputMessage, setInputMessage] = useState('');  // 입력된 메시지 상태
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태 확인
    const stompClientRef = useRef(null); // stompClient를 useRef로 관리
    let subscriptionUrl = '';
    let messageTopic = '';

    // WebSocket 연결 함수
    const connectWebSocket = () => {
        if (!userId || !chatRoomId) {
            console.error("User ID 또는 ChatRoom ID가 정의되지 않음");
            return; // userId 또는 chatRoomId가 없으면 WebSocket 연결하지 않음
        }

        console.log(`WebSocket 연결 시도 - ChatRoom ID: ${chatRoomId}`);

        const socket = new WebSocket('ws://100.64.0.10:9999/ws');
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient; // stompClient를 ref에 저장

        if (topic === "create-room-one") {
            subscriptionUrl = `/topic/messages/${chatRoomId}`;
            messageTopic = 'one';
        } else{
            subscriptionUrl = `/topic/group/${chatRoomId}`;
            messageTopic = 'many';
        }

        stompClient.connect({}, (frame) => {
            console.log('WebSocket이 연결되었습니다: ' + frame);
            setIsConnected(true); // WebSocket 연결 상태를 true로 설정
            console.log(topic);

            // WebSocket 메시지 구독
            stompClient.subscribe(subscriptionUrl, (message) => {
                const receivedMessage = JSON.parse(message.body);

                // 서버로부터 받은 메시지 중에서 본인의 메시지는 제외
                if (receivedMessage.senderId === userId) {
                    return;  // 본인이 보낸 메시지는 무시
                }

                // 서버로부터 받은 메시지를 왼쪽 말풍선에 추가 (다른 사용자의 메시지)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: receivedMessage.content, name: receivedMessage.senderNickName, isMine: false }
                ]);
            });
        }, (error) => {
            console.error('WebSocket 오류 발생: ', error);
            setIsConnected(false); // WebSocket 연결 실패 시 false로 설정
        });
    };

    // 메시지 전송 함수
    const sendMessage = () => {
        const stompClient = stompClientRef.current;
        if (!isConnected || !stompClient || inputMessage.trim() === '') {
            console.error('WebSocket이 연결되지 않았거나 메시지가 비어있음');
            return; // 연결되지 않았거나 메시지가 비어있으면 전송하지 않음
        }


        // 메시지 전송
        const messageObj = {
            senderName: name,
            chatRoomId: chatRoomId,
            senderId: userId,
            recipientId: activeRoom.participants,  // 수신자 목록을 recipientId에 추가
            content: inputMessage,
            announcement: '',
            fileUrl: '',
            topic: 'one'
        };

        stompClient.send('/app/chat', {}, JSON.stringify(messageObj));

        // 내가 보낸 메시지를 오른쪽 말풍선에 추가
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, name: name, isMine: true }
        ]);

        // 입력 창 비우기
        setInputMessage('');
    };

    // WebSocket 연결 설정
    useEffect(() => {
        if (userId && chatRoomId) {
            connectWebSocket();
        }
    }, [userId, chatRoomId]); // userId 또는 chatRoomId가 설정되면 WebSocket 연결

    // 메시지 입력 후 엔터 키로 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={`chat-room-container ${activeRoom ? 'open' : ''}`}>
            <div className="chat-header">
                <span>Chat Room: {activeRoom?.name || 'No room selected'}</span>
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="chat-body">
                {/* 메시지 출력 */}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isMine ? 'right' : 'left'}`}>
                        <div>{msg.name === name ? '' : msg.name}</div>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    className="chat-input"
                    type="text"
                    placeholder="Type a message"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoomContainer;
