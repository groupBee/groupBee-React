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
  const [participants, setParticipants] = useState([]);  // 배열로 초기화
  const [chatRoomName, setChatRoomName] = useState('');
  const [userId,setUserID]=useState('');
  const [name,setName]=useState('')
  const autoSelect = () => {
    axios.get("/api/employee/info")
      .then(res => {
        setUserID(res.data.id);
        setName(res.data.name);
        const userInfo = res.data;
        setParticipants(prev => {
          // 이전 참가자 목록에 내 정보가 이미 있는지 확인
          const isAlreadyAdded = prev.some(participant => participant.userId === userInfo.id);
  
          // 내 정보가 없으면 추가
          if (!isAlreadyAdded) {
            return [...prev, { userId: userInfo.id, name: userInfo.name }];
          }
          return prev;  // 이미 추가된 경우, 그대로 반환
        });
        console.log("내 정보가 자동으로 추가됨");
      })
      .catch(err => {
        console.error("내 정보 가져오기 실패:", err);
      });
  }
  useEffect(()=>{
    autoSelect();
  },[])
  const openModal = () => setModalOpen(true);

  const handleModalSelect = (value) => {
    // 내 정보 자동 추가

  
    // 현재 participants의 상태를 기준으로 업데이트된 participants를 설정
    setParticipants(prev => {
      // 기존 participants의 id 목록
      const existingIds = prev.map(participant => participant.userId);
  
      // 모달에서 받은 새로운 값 중 중복되지 않는 값만 필터링
      const newParticipants = value.filter(item => 
        !existingIds.includes(item.id)
      ).map(item => ({
        userId: item.id,
        name: item.name
      }));
  
      // 중복을 제거하여 최종 participants 설정
      const allParticipants = [...prev, ...newParticipants];
  
      // userId 기준으로 중복을 제거
      const uniqueParticipants = allParticipants.filter((participant, index, self) => 
        index === self.findIndex(p => p.userId === participant.userId)
      );
  
      return uniqueParticipants;
    });
  
    // 방 입력 창을 열고 모달을 닫음
    setShowRoomInput(true);
    setModalOpen(false);
  };

  const createChatting = () => {
    const data = {
      chatRoomId:'',
      chatRoomName,
      participants,
      lastMessage: '',
      topic: participants.length==2?'create-room-one':participants.length>2?'create-room-many':''
    };
    // API 호출
    axios.post("http://100.64.0.10:9999/api/chat/chatting/create", data, {
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
      <Sidebar onRoomClick={setActiveRoom} openModal={openModal} userId={userId}/>
      <ChatRoomContainer activeRoom={activeRoom}  userId={userId} name={name} onClose={() => setActiveRoom(null)} />
      <GroupModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleModalSelect} />
      {showRoomInput && (
        <Modal show={showRoomInput} onHide={() => {setShowRoomInput(false)}} centered>
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
