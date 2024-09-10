import { useState } from "react";
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
  const [lastActive, setLastActive] = useState('');
  const [topic, setTopic] = useState('');
  const openModal = () => setModalOpen(true);
  const handleModalSelect = (value) => {
    setParticipants(value.map(item => ({ userId: item.id, name: item.name })));
    setShowRoomInput(true);
    setModalOpen(false);
  };

  const createChatting = () => {

    // 새로운 채팅방 만들기

    const currentDate = new Date();
    console.log(currentDate);
    const formattedDate = currentDate.getFullYear() + '-' +
      String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(currentDate.getDate()).padStart(2, '0');
    setLastActive(formattedDate);
    console.log(formattedDate);
    console.log(participants.length);


    if (participants.length === 2) {
      setTopic("one");
    } else if (participants.length > 2) {
      setTopic("many")
    } else {
      alert('관리자 문의');
      return;
    }


    const data = {
      chatRoomName,
      lastActive: formattedDate, // 오늘 날짜 넣어야 함
      participants,
      lastMessage: '',
      topic: topic
    };

    // API 호출
    axios.post("/api/chat/chatting/create", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // 방 생성 후 로직 처리
      });

    // 방 생성 후 초기화
    setChatRoomName('');
    setParticipants([]);
    setShowRoomInput(false);
  };

  return (
    <div className="chat-container">
      <Sidebar onRoomClick={setActiveRoom} openModal={openModal} />
      <ChatRoomContainer activeRoom={activeRoom} onClose={() => setActiveRoom(null)} />

      <GroupModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleModalSelect} />
      {showRoomInput && (
        <Modal show={showRoomInput} onHide={() => setShowRoomInput(false)} centered>
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
