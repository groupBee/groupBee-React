import React, { useEffect, useState, useRef } from 'react';
import Stomp from 'stompjs';
import './ChatRoomContainer.css';
import axios from 'axios';


const ChatRoomContainer = ({ activeRoom, onClose, userId, name }) => {
    const [messages, setMessages] = useState([]);  // 모든 메시지를 저장할 배열
    const [inputMessage, setInputMessage] = useState('');  // 입력된 메시지 상태
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태 확인
    const stompClientRef = useRef(null); // stompClient를 useRef로 관리

    // 1. 웹 소켓 연결 함수
    const connectWebSocket = () => {
        if (!userId) return; // userId가 설정되지 않으면 WebSocket 연결하지 않음

        const socket = new WebSocket('ws://100.64.0.10:9999/ws');
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient; // stompClient를 ref에 저장

        stompClient.connect({}, (frame) => {
            console.log('WebSocket is connected with STOMP: ' + frame);
            setIsConnected(true); // WebSocket 연결 상태를 true로 설정

            // 2. /topic/messages 구독하여 서버로부터 실시간 메시지 수신
            stompClient.subscribe('/topic/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);

                // 서버로부터 받은 메시지를 왼쪽 말풍선에 추가 (다른 사용자의 메시지)
                if (receivedMessage.sender !== userId) { 
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: receivedMessage.message, name: receivedMessage.name, isMine: false }
                    ]);
                }
            });
        }, (error) => {
            console.error('WebSocket error: ', error);
            setIsConnected(false); // WebSocket 연결 실패 시 false로 설정
        });
    };

    // 3. 메시지 전송 함수
    const sendMessage = () => {
        const stompClient = stompClientRef.current;
        if (!isConnected || !stompClient || inputMessage.trim() === '') {
            console.error('WebSocket not connected or empty message');
            return; // 연결되지 않았거나 메시지가 비어있으면 전송하지 않음
        }

        // 메시지 전송 (사용자 ID를 포함하여 전송)
        const messageObj = {
            // message: inputMessage,
            // sender: userId,  // 내가 보낸 메시지임을 식별
            name: name,//
            chatRoomId:'d',
            senderId:userId,
            senderNickName:name,
            recipientId:[],
            content:inputMessage,
            announcement:'',
            fileUrl:'',


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

    // 4. 처음 로드될 때 WebSocket 연결 (userId가 설정된 후에 연결)
    useEffect(() => {
        if (userId) {
            connectWebSocket();
        }
    }, [userId]); // userId가 설정되면 WebSocket 연결

    // 메시지 입력 후 엔터 키로도 전송 가능하게 설정
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
                        <div>{msg.name===name?'':msg.name}</div>
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
