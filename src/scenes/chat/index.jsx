const Chat = () => {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
        <div style={{ width: '50%', borderRight: '1px solid #ddd', padding: '10px' }}>
          {/* Chat Room and Friend Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <button style={tabStyle(true)}>Chat Rooms</button>
              <button style={tabStyle(false)}>Friends</button>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button style={iconButtonStyle}>+</button>
              <button style={iconButtonStyle}>🔍</button>
              <button style={iconButtonStyle}>⋯</button>
            </div>
          </div>
  
          {/* Chat Rooms or Friend List */}
          <div style={listStyle}>
            <div style={listItemStyle}>Chat Room 1</div>
            <div style={listItemStyle}>Chat Room 2</div>
            <div style={listItemStyle}>Chat Room 3</div>
          </div>
        </div>
  
        <div style={{ width: '70%', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={chatHeaderStyle}>Chat Room: 123</div>
          <div style={chatContainerStyle}>
            <div style={leftMessageStyle}>Hi, there, response here!</div>
            <div style={rightMessageStyle}>Hello, my message 1</div>
          </div>
          <div style={inputContainerStyle}>
            <input style={inputStyle} type="text" placeholder="Type a message" />
            <button style={sendButtonStyle}>Send</button>
          </div>
        </div>
      </div>
    );
  };
  
  // 스타일을 정의
  const tabStyle = (active) => ({
    backgroundColor: active ? '#EAF1FF' : 'transparent',
    border: 'none',
    fontWeight: active ? 'bold' : 'normal',
    padding: '5px 15px',
    cursor: 'pointer',
    borderBottom: active ? '2px solid blue' : 'none',
  });
  
  const iconButtonStyle = {
    backgroundColor: '#F5C542',
    border: 'none',
    borderRadius: '5px',
    width: '35px',
    height: '35px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  };
  
  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };
  
  const listItemStyle = {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
  };
  
  const chatHeaderStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };
  
  const chatContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
  };
  
  const leftMessageStyle = {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '10px',
    maxWidth: '60%',
  };
  
  const rightMessageStyle = {
    alignSelf: 'flex-end',
    backgroundColor: '#D4F8C0',
    borderRadius: '10px',
    padding: '10px',
    maxWidth: '60%',
    position: 'relative',
  };
  
  const inputContainerStyle = {
    display: 'flex',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  };
  
  const inputStyle = {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
  };
  
  const sendButtonStyle = {
    backgroundColor: '#5CB85C',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
  export default Chat;
  