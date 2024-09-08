import { useState } from "react";
import Sidebar from "./Sidebar.jsx"; 
import ChatRoomContainer from "./ChatRoomContainer.jsx"; 
import GroupModal from "../../components/groupModal.jsx"; 
import { Modal } from "react-bootstrap";
import './Chat.css'; 

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatRoomName, setChatRoomName] = useState('');

  const openModal = () => setModalOpen(true);
  const handleModalSelect = (value) => {
    setParticipants(value.map(item => ({ id: item.id, name: item.name })));
    setShowRoomInput(true);
    setModalOpen(false);
  };

  const createChatting = () => {
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
