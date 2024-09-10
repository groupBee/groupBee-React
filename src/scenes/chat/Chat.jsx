import { useEffect, useState } from "react";
import Sidebar from "./chatList.jsx";
import ChatRoomContainer from "./ChatRoomContainer.jsx";
import GroupModal from "../../components/groupModal.jsx";
import { Modal } from "react-bootstrap";
import './Chat.css';
import axios from "axios";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [participants, setParticipants] = useState([]);  
  const [chatRoomName, setChatRoomName] = useState('');
  const [userId, setUserID] = useState('');
  const [name, setName] = useState('');

  // 유저 정보를 불러오는 함수
  const autoSelect = () => {
    axios.get("/api/employee/info")
      .then(res => {
        setUserID(res.data.id);
        setName(res.data.name);
        const userInfo = res.data;
        setParticipants(prev => {
          const isAlreadyAdded = prev.some(participant => participant.userId === userInfo.id);
          if (!isAlreadyAdded) {
            return [...prev, { userId: userInfo.id, name: userInfo.name }];
          }
          return prev;
        });
        console.log("내 정보가 자동으로 추가됨");
      })
      .catch(err => {
        console.error("내 정보 가져오기 실패:", err);
      });
  };

  useEffect(() => {
    autoSelect();
  }, []);

  const openModal = () => setModalOpen(true);

  const handleModalSelect = (value) => {
    setParticipants(prev => {
      const existingIds = prev.map(participant => participant.userId);
      const newParticipants = value.filter(item =>
        !existingIds.includes(item.id)
      ).map(item => ({
        userId: item.id,
        name: item.name
      }));
      const allParticipants = [...prev, ...newParticipants];
      const uniqueParticipants = allParticipants.filter((participant, index, self) =>
        index === self.findIndex(p => p.userId === participant.userId)
      );
      return uniqueParticipants;
    });
    setShowRoomInput(true);
    setModalOpen(false);
  };

  const createChatting = () => {
    const data = {
      chatRoomId: '',
      chatRoomName,
      participants,
      lastMessage: '',
      topic: participants.length === 2 ? 'create-room-one' : participants.length > 2 ? 'create-room-many' : ''
    };
    axios.post("http://100.64.0.10:9999/api/chat/chatting/create", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // 방 생성 후 로직 처리
    });
    setChatRoomName('');
    setParticipants([]);
    setShowRoomInput(false);
    getChatRoomList();
  };

  // Sidebar에서 클릭된 채팅방을 처리
  const handleRoomClick = (room) => {
    setActiveRoom(room);
  };

  return (
    <div className="chat-container">
      <Sidebar onRoomClick={handleRoomClick} openModal={openModal} userId={userId} />
      {activeRoom && (
        <ChatRoomContainer
          activeRoom={activeRoom}
          chatRoomId={activeRoom.chatRoomId}  // chatRoomId 전달
          userId={userId}  // userId 전달
          participants={activeRoom.participants}
          name={name}
          onClose={() => setActiveRoom(null)}
        />
      )}
      <GroupModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleModalSelect} />
      {showRoomInput && (
        <Modal show={showRoomInput} onHide={() => { setShowRoomInput(false) }} centered>
          <Modal.Header closeButton>
            <Modal.Title>방 제목 입력</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>참가자: {participants.map(p => p.name).join(', ')}</p>
            <input
              type="text"
              value={chatRoomName}
              onChange={(e) => setChatRoomName(e.target.value)}
              placeholder="방 제목 입력"
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={createChatting} style={{ width: '100%', padding: '10px', backgroundColor: '#5CB85C', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              방 만들기
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Chat;
