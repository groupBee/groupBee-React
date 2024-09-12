import { useEffect, useState, useRef } from 'react';
import './chatList.css';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add'; // + 아이콘
import SearchIcon from '@mui/icons-material/Search'; // 돋보기 아이콘
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {MoreHoriz} from "@mui/icons-material"; // ⋯ 아이콘

const Sidebar = ({profile, formatDate, setActiveRoom, onRoomClick, openModal, userId, getChatRoomList, chatRoomList, setFilteredRoomList, filteredRoomList }) => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [isOverallDropdownOpen, setIsOverallDropdownOpen] = useState(false); // 전체 채팅방 드롭다운
  const [selectedRoomDropdown, setSelectedRoomDropdown] = useState(null); // 개별 채팅방 드롭다운
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 검색창 보임 여부
  const overallDropdownRef = useRef(null); // 전체 채팅방 드롭다운 참조
  const roomDropdownRefs = useRef({}); // 개별 채팅방 드롭다운 참조들

  useEffect(() => {
    if (userId) {
      getChatRoomList();
    }
  }, [userId]);

  // 채팅방 나가기 (개별)
  const exitChatRoom = (roomId) => {
    console.log(roomId);
    axios
      .delete(`/api/chat/chatting/delete`, { params: { chatRoomId: roomId, userId: userId } })
      .then((res) => {
        console.log('채팅방 나가기 성공:', res);
        getChatRoomList();
        setActiveRoom(null);
      })
      .catch((err) => {
        console.error('채팅방 나가기 실패:', err);
      });
  };


  // 전체 채팅방 나가기
  const exitAllChatRooms = () => {
    axios.delete(`/api/chat/chatting/exitAll`, { params: { userId: userId } })
      .then((res) => {
        console.log('전체 채팅방 나가기 성공:', res);
        getChatRoomList();
      })
      .catch((err) => {
        console.error('전체 채팅방 나가기 실패:', err);
      });
    setActiveRoom(null);
  };

  // 검색어에 따라 채팅방 필터링
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredRoomList(chatRoomList); // 검색어 없으면 전체 채팅방 리스트
    } else {
      const filteredRooms = chatRoomList.filter((room) =>
        room.chatRoomName.toLowerCase().includes(searchValue)
      );
      setFilteredRoomList(filteredRooms); // 검색어에 맞는 채팅방 필터링
    }
  };

  const toggleOverallDropdown = () => {
    setIsOverallDropdownOpen((prev) => !prev);
  };

  const toggleRoomDropdown = (roomId) => {
    setSelectedRoomDropdown(selectedRoomDropdown === roomId ? null : roomId);
  };

  const handleClickOutside = (event) => {
    if (overallDropdownRef.current && !overallDropdownRef.current.contains(event.target)) {
      setIsOverallDropdownOpen(false);
    }
    if (selectedRoomDropdown !== null && roomDropdownRefs.current[selectedRoomDropdown] && !roomDropdownRefs.current[selectedRoomDropdown].contains(event.target)) {
      setSelectedRoomDropdown(null);
    }
  };

  // 검색창 보이기/숨기기 함수
  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);  // 검색창 상태 토글
  };

  // 외부 클릭 감지 이벤트 등록
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedRoomDropdown, isOverallDropdownOpen]);

  // 참가자 리스트를 형식에 맞게 보여주기
  const renderParticipants = (participants) => {
    const names = participants.map((p) => p.name);
    if (names.length > 5) {
      return `${names.slice(0, 5).join(', ')}...`;  // 5명까지 표시하고 나머지는 "..."
    }
    return names.join(', ');  // 참가자들을 쉼표로 구분하여 표시
  };

  return (
    <div className="sidebar2">
      <div className="tab-header">
        <div className="tab-buttons">
          <button className="tab-button active">Chat Rooms</button>
          {/* 검색창이 보일 때만 표시 */}
          <input
            type="text"
            style={{ display: isSearchVisible ? 'block' : 'none' }} // 검색창이 보일 때만 block
            placeholder="Search Chat Rooms"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="icon-buttons2" ref={overallDropdownRef}>
          <button className="icon-button" onClick={openModal}>
            <AddIcon/> {/* + 아이콘 */}
          </button>
          <button className="icon-button" onClick={toggleSearch}>
            <SearchIcon/> {/* 돋보기 아이콘 */}
          </button>
          <button className="icon-button" onClick={toggleOverallDropdown}>
            <MoreHoriz/> {/* ⋯ 아이콘 */}
          </button>
          <div className={`dropdown-menu ${isOverallDropdownOpen ? 'open' : ''}`}>
            <button className="dropdown-item" onClick={exitAllChatRooms}>
              전체 채팅방 나가기
            </button>
          </div>
        </div>
      </div>

      <div className="chat-list">
        {filteredRoomList.map((room, idx) => (
            <div key={idx} className="chat-room" onClick={() => onRoomClick(room)}>
              <div className="chat-info" onClick={() => onRoomClick(room)}>
              <span className="chat-room-name">{room.chatRoomName}&nbsp;&nbsp;
                <b style={{fontSize: '10px', color: 'gray'}}>{renderParticipants(room.participants)}&nbsp;&nbsp;({room.participants.length})</b> {/* 참가자 리스트 표시 */}
              </span>
              <span className="last-message" style={{fontSize:'18px'}}>{room.lastMessage}</span>
             
            </div>

            <div className="chat-meta">
              <span className="time">{formatDate(room.lastActive)}</span>
              {room.unreadCount > 0 && (
                <span className="unread-badge">{room.unreadCount}</span>
              )}
              <button
                className="icon-button"
                onClick={(e) => {
                  e.stopPropagation(); // 버블링 방지
                  toggleRoomDropdown(room.chatRoomId);
                }}
              >
                ⋯
              </button>
              {selectedRoomDropdown === room.chatRoomId && (
                <div
                  className="room-dropdown open"
                  ref={(el) => (roomDropdownRefs.current[room.chatRoomId] = el)}
                >
                  <button
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation(); // 버블링 방지
                      exitChatRoom(room.chatRoomId);
                    }}
                  >
                    채팅방 나가기
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation(); // 버블링 방지
                      changeChatRoomName(room.chatRoomId);
                    }}
                  >
                    채팅방 이름 변경
                  </button>
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
