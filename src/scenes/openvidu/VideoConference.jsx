import React, { useEffect, useState } from 'react';
import {
    ControlBar, DisconnectButton,
    GridLayout,
    LiveKitRoom, MediaDeviceMenu,
    ParticipantTile,
    RoomAudioRenderer, TrackToggle,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { generateToken } from './livekit';
import { Box } from "@mui/material";
import { ChatComponent } from "./ChatComponent";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const serverUrl = 'https://openvidu.groupbee.co.kr';

const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export default function VideoConference() {
    const [token, setToken] = useState('');
    const [roomName, setRoomName] = useState('');
    const [participantName, setParticipantName] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [infoData, setInfoData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageCount, setMessageCount] = useState(0);
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employee/info');
            const data = await response.json();
            setInfoData(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (infoData && infoData.name) {
            setParticipantName(infoData.name);
        }
    }, [infoData]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (hasJoined && roomName) {
            fetchToken();
        }
    }, [roomName]);

    const fetchToken = async () => {
        try {
            const token = await generateToken(roomName, participantName);
            setToken(token);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleJoinRoom = () => {
        if (roomName.trim() && participantName.trim()) {
            const generatedInviteCode = generateRandomCode(20);
            setRoomName(generatedInviteCode);
            fetchToken();
            setHasJoined(true);
            console.log('UUID : ' + generatedInviteCode);
        } else {
            alert("방 이름을 입력하세요.");
        }
    };

    const handleJoinRoom2 = () => {
        if (roomName.length !== 20) {
            setErrorMessage("잘못된 초대코드입니다.");
            return;
        }

        if (roomName.trim() && participantName.trim()) {
            fetchToken();
            setHasJoined(true);
            setErrorMessage('');
        } else {
            setErrorMessage("방 이름을 입력하세요.");
        }
    };

    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
        if (!isChatVisible) {
            setMessageCount(0);
        }
    };

    const handleSendMessage = (message) => {
        setMessages([...messages, { sender: participantName, text: message }]);
    };

    const handleNewMessage = (timestamp) => {
        if (!isChatVisible && timestamp > lastMessageTimestamp) {
            setMessageCount(prevCount => prevCount + 1);
        }
        setLastMessageTimestamp(timestamp);
    };

    if (!hasJoined) {
        return (
            <Box
                sx={{
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                    maxWidth: '1400px',
                    margin: '20px auto',
                    textAlign: 'center',
                    width: '40%',
                    height: '300px',
                    marginTop: '100px',
                    padding: '50px 40px'
                }}
            >
                <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>화상회의 참여</h2>
                <Box sx={{ padding: '0px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="방 이름 / 초대코드 입력"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={{
                            margin: '10px auto',
                            padding: '12px 16px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            width: '80%',
                            display: 'block',
                        }}
                    />
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </Box>
                <div style={{ gap: '15px', display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <button
                        onClick={handleJoinRoom}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#ffb121',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffa500'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffb121'}
                    >
                        방 생성
                    </button>
                    <button
                        onClick={handleJoinRoom2}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cc0000'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'}
                    >
                        초대코드
                    </button>
                </div>
            </Box>
        );
    }

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{height: '88.5vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{
                padding: '10px',
                backgroundColor: '#f1f1f1',
                textAlign: 'center',
                fontSize: '16px',
                borderTop: '1px solid #ccc'
            }}>
                초대 코드: <strong>{roomName}</strong>
            </div>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={serverUrl}
                data-lk-theme="default"
                style={{
                    height: '88.5vh',
                    width: isChatVisible ? '71%' : '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.3s, visibility 0.3s, opacity 0.3s',
                }}
            >
                <RoomAudioRenderer/>
                <MyVideoConference/>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isChatVisible ?'75%':'100%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                    transition: 'width 0.3s, visibility 0.3s, opacity 0.3s',
                }}>
                    <div className="lk-button-group" style={{marginRight:'1%'}}>
                        <TrackToggle source={Track.Source.Microphone} />
                        <div className="lk-button-group-menu">
                            <MediaDeviceMenu kind="audioinput" />
                        </div>
                    </div>
                    <div className="lk-button-group" style={{marginRight:'1%'}}>
                        <TrackToggle source={Track.Source.Camera} />
                        <div className="lk-button-group-menu">
                            <MediaDeviceMenu kind="videoinput"/>
                        </div>
                    </div>
                    <div style={{display:'inline-flex', alignItems:'stretch'}}>
                        <DisconnectButton
                            onClick={() => {
                                setHasJoined(false);
                                setRoomName('');
                                setToken('');
                            }}
                        >
                            방 나가기
                        </DisconnectButton>
                    </div>
                </div>
                <button
                    onClick={toggleChat}
                    style={{
                        position: 'fixed',
                        bottom:isChatVisible ? '83%': '0%',
                        right: '10px',
                        backgroundColor: '#1c1c1c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 1100,
                    }}
                >
                    {isChatVisible ? <CloseIcon /> : <ChatIcon />}
                    {!isChatVisible && messageCount > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '12px',
                        }}>
                            {messageCount}
                        </div>
                    )}
                </button>

                <div
                    style={{
                        position: 'fixed',
                        bottom: '0px',
                        right: '0px',
                        width: isChatVisible ? '25%' : '0%',
                        height: '88.75%',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        transition: 'width 0.3s, visibility 0.3s, opacity 0.3s',
                        visibility: isChatVisible ? 'visible' : 'hidden',
                        opacity: isChatVisible ? 1 : 0,
                    }}
                >
                    <ChatComponent
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onNewMessage={handleNewMessage}
                    />
                </div>
            </LiveKitRoom>
        </div>
    );
}

function MyVideoConference() {
    const tracks = useTracks(
        [
            {source: Track.Source.Camera, withPlaceholder: true},
            {source: Track.Source.ScreenShare, withPlaceholder: false},
        ],
        {onlySubscribed: false},
    );
    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: 'calc(100vh - 70px)',
                width: '100%',
                backgroundColor: 'black',
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}