import './ChatRoomContainer.css';

const ChatRoomContainer = ({ activeRoom, onClose }) => {
  return (
    <div className={`chat-room-container ${activeRoom ? 'open' : ''}`}>
      <div className="chat-header">
        <span>Chat Room: {activeRoom?.name || 'No room selected'}</span>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="chat-body">
        <div className="message left">Hi, there, response here!</div>
        <div className="message right">Hello, my message 1</div>
      </div>
      <div className="input-container">
        <input className="chat-input" type="text" placeholder="Type a message" />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatRoomContainer;
