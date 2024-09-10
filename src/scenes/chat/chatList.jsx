import { useEffect, useState, useRef } from 'react';
import './chatList.css';
import axios from 'axios';

const Sidebar = ({ onRoomClick, openModal, userId }) => {
  const [chatRoomList, setChatRoomList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoomDropdown, setSelectedRoomDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      getChatRoomList();
    }
  }, [userId]);

  // 채팅방 나가기 (개별)
  const exitChatRoom = (roomId) => {
    axios.delete(`http://100.64.0.10:9999/api/chat/chatting/delete`, {
      data: { chatRoomId: roomId },
    })
    .then(res => {
      console.log('채팅방 나가기 성공:', res);
      getChatRoomList();
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
      getChatRoomList();
    })
    .catch(err => {
      console.error('전체 채팅방 나가기 실패:', err);
    });
  };

  // 내 채팅방 목록 가져오기
  const getChatRoomList = () => {
    const data = { userId };
    console.log("userId===" + userId);

    axios.post('http://100.64.0.10:9999/api/chat/chatting/list', data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      setChatRoomList(res.data);
      console.log(res.data);
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleRoomDropdown = (roomId) => {
    setSelectedRoomDropdown(selectedRoomDropdown === roomId ? null : roomId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSelectedRoomDropdown(null);
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
              <button className="icon-button" onClick={() => toggleRoomDropdown(room.chatRoomId)}>⋯</button>
              {selectedRoomDropdown === room.chatRoomId && ( 
                <div className="room-dropdown open">
                  <button className="dropdown-item" onClick={() => exitChatRoom(room.chatRoomId)}>채팅방 나가기</button>
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
