import { useEffect, useState, useRef } from 'react';
import './chatList.css';
import axios from 'axios';

const Sidebar = ({ onRoomClick, openModal, userId }) => {
  const [chatRoomList, setChatRoomList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 전체 드롭다운 상태
  const [selectedRoomDropdown, setSelectedRoomDropdown] = useState(null); // 선택된 채팅방의 드롭다운 상태
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      getChatRoomList(); // userId가 있을 때만 채팅방 목록을 가져옴
    }
  }, [userId]);

  // 채팅방 나가기 (개별)
  const exitChatRoom = (roomId) => {
    axios.delete(`http://100.64.0.10:9999/api/chat/chatting/delete`, {
      data: { chatRoomId: roomId },
    })
    .then(res => {
      console.log('채팅방 나가기 성공:', res);
      getChatRoomList(); // 채팅방 목록 다시 불러오기
    })
    .catch(err => {
      console.error('채팅방 나가기 실패:', err);
    });
  };

  // 전체 채팅방 나가기
  const exitAllChatRooms = () => {
    axios.post('http://100.64.0.10:9999/api/chat/chatting/all-exit', {
      userId: userId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      console.log('전체 채팅방 나가기 성공:', res);
      getChatRoomList(); // 채팅방 목록 다시 불러오기
    })
    .catch(err => {
      console.error('전체 채팅방 나가기 실패:', err);
    });
  };

  // 내 채팅방 목록 가져오기 (샘플 데이터 사용)
  // const getChatRoomList = () => {
  //   const sampleChatRooms = Array.from({ length: 10 }, (_, idx) => ({
  //     id: idx + 1,
  //     name: `Chat Room ${idx + 1}`,
  //     lastMessage: `This is the last message for Chat Room ${idx + 1}`,
  //     lastActiveTime: `2024-09-10 14:0${idx}`, // 임의의 시간
  //     unreadCount: Math.floor(Math.random() * 10), // 임의의 안 읽은 메시지 수
  //   }));

  //   setChatRoomList(sampleChatRooms);
  // };

    //내 채팅방 목록 가져오기
  const getChatRoomList = () => {

    const data = {
      userId
    };
    console.log("userId===" + userId)

    axios.post('http://100.64.0.10:9999/api/chat/chatting/list', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
      .then(res => {
        setChatRoomList(res.data);
        console.log(res.data)
      })

  }

  // 전체 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev); // 전체 드롭다운 토글
  };

  // 채팅방 개별 드롭다운 토글
  const toggleRoomDropdown = (roomId) => {
    setSelectedRoomDropdown(selectedRoomDropdown === roomId ? null : roomId); // 선택된 드롭다운 상태 토글
  };

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // 전체 드롭다운 닫기
        setSelectedRoomDropdown(null); // 개별 드롭다운 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="sidebar">
      <div className="tab-header">
        <div className="tab-buttons">
          <button className="tab-button active">Chat Rooms</button>
          <button className="tab-button">Friends</button>
        </div>

        <div className="icon-buttons" ref={dropdownRef}>
          <button className="icon-button" onClick={openModal}>+</button>
          <button className="icon-button">🔍</button>
          <button className="icon-button" onClick={toggleDropdown}>⋯</button>

          {/* 전체 채팅방 드롭다운 메뉴 */}
          <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
            <button className="dropdown-item" onClick={exitAllChatRooms}>전체 채팅방 나가기</button>
          </div>
        </div>
      </div>

      <div className="chat-list">
        {chatRoomList.map((room, idx) => (
          <div key={idx} className="chat-room">
            <div className="chat-info" onClick={() => onRoomClick(room)}>
              <span className="chat-room-name">{room.chatRoomName}</span>
              <span className="last-message">{room.lastMessage}</span>
            </div>

            <div className="chat-meta">
              <span className="time">{room.lastActive}</span>
              {room.unreadCount > 0 && <span className="unread-badge">{room.unreadCount}</span>}
              {/* 채팅방 개별 드롭다운 */}
              <button className="icon-button" onClick={() => toggleRoomDropdown(room.id)}>⋯</button>

              {/* 개별 채팅방 드롭다운 메뉴 */}
              {selectedRoomDropdown === room.id && (
                <div className="room-dropdown open">
                  <button className="dropdown-item" onClick={() => exitChatRoom(room.id)}>채팅방 나가기</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
