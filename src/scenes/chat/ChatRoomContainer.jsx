import { useEffect, useState, useRef } from 'react';
import Stomp from 'stompjs';
import './ChatRoomContainer.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const ChatRoomContainer = ({ activeRoom, onClose, userId, name, chatRoomId, topic , formatDate}) => {
    const [messages, setMessages] = useState([]);  // 모든 메시지를 저장할 배열
    const [inputMessage, setInputMessage] = useState('');  // 입력된 메시지 상태
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태 확인
    const stompClientRef = useRef(null); // stompClient를 useRef로 관리
    const [messageTopic, setMessageTopic] = useState('');

    const chatBodyRef = useRef(null); // 채팅 메시지를 담는 div를 참조하는 ref

    let subscriptionUrl = '';

    

    // WebSocket 연결 함수
    const connectWebSocket = () => {
        if (!userId || !chatRoomId) {
            console.error("User ID 또는 ChatRoom ID가 정의되지 않음");
            return; // userId 또는 chatRoomId가 없으면 WebSocket 연결하지 않음
        }

        console.log(`WebSocket 연결 시도 - ChatRoom ID: ${chatRoomId}`);

        const socket = new WebSocket(`${import.meta.env.VITE_WS_URI}/ws`);
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient; // stompClient를 ref에 저장

        if (topic === "create-room-one") {
            console.log("Setting messageTopic to 'one'");
            subscriptionUrl = `/topic/messages/${chatRoomId}`;
            setMessageTopic('one')
        } else {
            console.log("Setting messageTopic to 'many'");
            subscriptionUrl = `/topic/group/${chatRoomId}`;
            setMessageTopic('many')
        }

        stompClient.connect({}, (frame) => {
            console.log('WebSocket이 연결되었습니다: ' + frame);
            setIsConnected(true); // WebSocket 연결 상태를 true로 설정

            // WebSocket 메시지 구독
            stompClient.subscribe(subscriptionUrl, (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("수신한 메시지:", receivedMessage);

                // 서버로부터 받은 메시지 중에서 본인의 메시지는 제외
                if (receivedMessage.senderId === userId) {
                    return;  // 본인이 보낸 메시지는 무시
                }

                // 서버로부터 받은 메시지를 왼쪽 말풍선에 추가 (다른 사용자의 메시지)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { content: receivedMessage.content, senderName: receivedMessage.senderName, isMine: false , name:receivedMessage.senderName}
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
            console.error('WebSocket이 연결되지 않았거나 stompClient가 초기화되지 않았거나 메시지가 비어있습니다.');
            return;
        }

        const messageObj = {
            senderName: name,  // 사용자명
            chatRoomId: chatRoomId,
            senderId: userId,
            recipientId: activeRoom.participants,  // 수신자 목록
            content: inputMessage,
            announcement: '',
            fileUrl: '',
            topic: messageTopic,
            timestamp: new Date()
        };

        try {
            // 서버로 메시지 전송
            stompClient.send('/app/chat', {}, JSON.stringify(messageObj));

            // 내가 보낸 메시지를 오른쪽 말풍선에 추가
            setMessages(prevMessages => [
                ...prevMessages,
                { content: inputMessage, senderId: userId, senderName: name, isMine: true , timestamp: new Date()}
            ]);

            setInputMessage('');  // 입력창 비우기
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    // 채팅 히스토리 로드 함수
    const getChatHistory = () => {
        axios('/api/chat/chatting/history?chatRoomId=' + chatRoomId)
            .then(res => {
                const chatHistory = res.data;
                console.log("받은 채팅 기록:", chatHistory);
                // 오래된 메시지 순으로 정렬하여 저장
                setMessages(chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
            })
            .catch(err => {
                console.error('채팅 기록을 불러오는데 실패했습니다: ', err);
            });
    };

    // WebSocket 연결 및 채팅 히스토리 로드
    useEffect(() => {
        if (userId && chatRoomId) {
            connectWebSocket();
            getChatHistory();  // 채팅방에 입장할 때 채팅 기록 불러오기
        }
    }, [userId, chatRoomId]);


    // 메시지 입력 후 엔터 키로 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // 메시지가 업데이트될 때마다 스크롤을 아래로 이동시키는 함수
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);  // messages 배열이 변경될 때마다 실행


    // 채팅 메시지 UI 렌더링
    return (
        <div className={`chat-room-container ${activeRoom ? 'open' : ''}`}>
            <div className="chat-header">
                <span style={{ fontSize: '30px' }}>{activeRoom?.chatRoomName || 'No room selected'}</span>
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                {/* 메시지 출력 */}
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.senderId === userId ? 'right' : 'left'}`}>
                        {msg.senderId === userId ? (
                            <>
                                {/* 오른쪽 말풍선일 때 시간 왼쪽에 */}
                                <div className="message-timestamp">{msg.timestamp && formatDate(msg.timestamp)}</div>
                                <div className={`message right`}>
                                    <div className="message-content">{msg.content}</div> {/* 메시지 내용 표시 */}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* 왼쪽 말풍선일 때 시간 오른쪽에 */}
                                <div className={`message left`}>
                                    <div>{msg.senderName}</div> {/* 이름을 왼쪽 메시지에만 표시 */}
                                    <div className="message-content">{msg.content}</div> {/* 메시지 내용 표시 */}
                                </div>
                                <div className="message-timestamp">{msg.timestamp && formatDate(msg.timestamp)}</div>
                            </>
                        )}
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
