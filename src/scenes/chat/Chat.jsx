import { useEffect, useState } from "react";
import Sidebar from "./chatList.jsx";
import ChatRoomContainer from "./ChatRoomContainer.jsx";
import GroupModal from "../../components/groupModal.jsx";
import { Modal } from "react-bootstrap";
import './Chat.css';
import axios from "axios";
import logo_grey from "../../assets/images/logo-photoaidcom-greyscale.png";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatRoomName, setChatRoomName] = useState('');
  const [userId, setUserID] = useState('');
  const [name, setName] = useState('');
  const [chatRoomList, setChatRoomList] = useState([]);
  const [filteredRoomList, setFilteredRoomList] = useState([]); // 필터링된 채팅방 목록
  const [profile,setProfile]=useState((''));//내 프로필 사진
  const [isChatRoomVisible, setIsChatRoomVisible] = useState(false);

  // 유저 정보를 불러오는 함수
  const autoSelect = () => {
    axios.get("/api/employee/info")
      .then(res => {
        setUserID(res.data.id);
        setName(res.data.name);
        setProfile(res.data.profileFile
        );
        const userInfo = res.data;
        setParticipants(prev => {
          const isAlreadyAdded = prev.some(participant => participant.userId === userInfo.id);
          if (!isAlreadyAdded) {
            return [...prev, { userId: userInfo.id, name: userInfo.name, profile:userInfo.profileFile }];
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
  // 내 채팅방 목록 가져오기
  const getChatRoomList = () => {
    const data = { userId };
    console.log('userId===', userId);

    axios
      .post('/api/chat/chatting/list', data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setChatRoomList(res.data);
        setFilteredRoomList(res.data); // 초기엔 전체 리스트 표시
        console.log(res.data);
      });
  };

  const openModal = () => setModalOpen(true);

  //모달에서 필요한 값 가져오기 '참가자 정보'
  const handleModalSelect = (value) => {
    console.log("3123123123"+value[0])
    setParticipants(prev => {
      const existingIds = prev.map(participant => participant.userId);
      const newParticipants = value.filter(item =>
        !existingIds.includes(item.id)
      ).map(item => ({
        userId: item.id,
        name: item.name,
        profile: item.profileFile
      }));
      //기존에 내가 미리 들어갔으므로 기존에 있던 참가자 (나)빼고 다 넣기
      const allParticipants = [...prev, ...newParticipants];
      //내가 참여자로 선택되면 자동으로 빼기
      const uniqueParticipants = allParticipants.filter((participant, index, self) =>
        index === self.findIndex(p => p.userId === participant.userId)
      );
      console.log('사진제발'+profile)
      console.log(uniqueParticipants);
      return uniqueParticipants;
    });
    console.log("참가자참가자"+participants);
    setShowRoomInput(true);
    setModalOpen(false);
  };
//참가자 선택 후 확인버튼 눌렀을때
  const createChatting = () => {
    const data = {
      chatRoomId: '',
      chatRoomName,
      participants,
      lastMessage: '',
      topic: participants.length === 2 ? 'create-room-one' : participants.length > 2 ? 'create-room-many' : ''
    };
    axios.post("/api/chat/chatting/create", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // 방 생성 후 로직 처리
      getChatRoomList();
    });
    setChatRoomName('');
    setParticipants([]);
    setShowRoomInput(false);
  };

  // Sidebar에서 클릭된 채팅방을 처리
  // Sidebar에서 클릭된 채팅방을 처리
  const handleRoomClick = (room) => {
    setActiveRoom(room);
    setIsChatRoomVisible(true);
  };

  const handleCloseChatRoom = () => {
    setIsChatRoomVisible(false);
    setTimeout(() => setActiveRoom(null), 300); // 트랜지션이 끝난 후 activeRoom을 null로 설정
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    const isToday = date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // 두 자릿수로 포맷팅하는 헬퍼 함수
    const formatTwoDigits = (num) => (num < 10 ? `0${num}` : num);

    const hours = formatTwoDigits(date.getHours());
    const minutes = formatTwoDigits(date.getMinutes());

    if (isToday) {
        // 오늘 날짜일 경우 시:분만 반환
        return `${hours}:${minutes}`;
    } else {
        // 오늘이 아닐 경우 월/일 시:분 반환
        const month = formatTwoDigits(date.getMonth() + 1);
        const day = formatTwoDigits(date.getDate());
        return `${month}/${day} ${hours}:${minutes}`;
    }
}

  const chatRoomStyle = {
    width: '40%',
    height:'91%',
    transform: `translateX(${isChatRoomVisible ? '0' : '100%'})`,
    transition: 'transform 0.3s ease-in-out',
    position: 'absolute',
    top: '8%',
    left: '58%',
    backgroundColor: 'transparent',
  };

  return (
      <div className="chat-container">
        <div className="sidebar-container">
          <Sidebar
              formatDate={formatDate}
              setActiveRoom={setActiveRoom}
              filteredRoomList={filteredRoomList}
              setFilteredRoomList={setFilteredRoomList}
              onRoomClick={handleRoomClick}
              openModal={openModal}
              userId={userId}
              getChatRoomList={getChatRoomList}
              chatRoomList={chatRoomList}
          />
        </div>
        <div className={`chatroom-container ${isChatRoomVisible ? 'visible' : ''}`}>
          {activeRoom && (
              <ChatRoomContainer
                  formatDate={formatDate}
                  activeRoom={activeRoom}
                  chatRoomId={activeRoom.chatRoomId}
                  userId={userId}
                  profile={profile}
                  participants={activeRoom.participants}
                  name={name}
                  topic={activeRoom.topic}
                  getChatRoomList={getChatRoomList}
                  onClose={handleCloseChatRoom}
              />
          )}
        </div>
        {!isChatRoomVisible && (
              <img src={logo_grey} alt="Logo" className={`grey-logo ${isChatRoomVisible ? 'visible' : ''}`}/>
        )}
        <GroupModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleModalSelect}/>
        {showRoomInput && (
            <Modal show={showRoomInput} onHide={() => {
              setShowRoomInput(false)
            }} centered>
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
                    style={{width: '100%', padding: '10px', margin: '10px 0'}}
                />
              </Modal.Body>
              <Modal.Footer>
                <button onClick={createChatting} style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#5CB85C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  방 만들기
                </button>
              </Modal.Footer>
            </Modal>
        )}
      </div>
  );
};

export default Chat;
