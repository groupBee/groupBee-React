import { useEffect, useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onRoomClick, openModal }) => {
  const [chatRoomList, setChatRoomList] = useState([]);

  useEffect(() => {
    setChatRoomList([
      {
        name: "곽바다",
        lastMessage: "어키어키",
        unreadCount: 3,
        lastActiveTime: "오전 10:01",
      },
      {
        name: "홍길동",
        lastMessage: "안녕하세요",
        unreadCount: 0,
        lastActiveTime: "오전 9:30",
      },
    ]);
  }, []);

  return (
    <div className="sidebar">
      <div className="tab-header">
        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button className="tab-button active">Chat Rooms</button>
          <button className="tab-button">Friends</button>
        </div>

        {/* Icon Buttons */}
        <div className="icon-buttons">
          <button className="icon-button" onClick={openModal}>+</button>
          <button className="icon-button">🔍</button>
          <button className="icon-button">⋯</button>
        </div>
      </div>

      <div className="chat-list">
        {chatRoomList.map((room, idx) => (
          <div key={idx} className="chat-room" onClick={() => onRoomClick(room)}>
            <div className="chat-info">
              <span className="chat-room-name">{room.name}</span>
              <span className="last-message">{room.lastMessage}</span>
            </div>
            <div className="chat-meta">
              <span className="time">{room.lastActiveTime}</span>
              {room.unreadCount > 0 && <span className="unread-badge">{room.unreadCount}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
