import React, { useEffect, useState } from 'react';
import {
    ControlBar, DisconnectButton,
    GridLayout,
    LiveKitRoom, MediaDeviceMenu,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { generateToken } from './livekit';
import { Box } from "@mui/material";
import { ChatComponent } from "./ChatComponent";
import ChatIcon from '@mui/icons-material/Chat';  // MUI 채팅 아이콘
import CloseIcon from '@mui/icons-material/Close';  // MUI 닫기 아이콘


const serverUrl = 'https://openvidu.groupbee.co.kr';

// 랜덤 문자열 생성 함수
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
    const [isChatVisible, setIsChatVisible] = useState(false);  // 채팅 토글 상태 추가

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                style={{ height: '100vh' }}
            >
                <MyVideoConference />
                <RoomAudioRenderer />
                <ControlBar/>
                <MediaDeviceMenu />
                < DisconnectButton  onClick={() => {
                    setHasJoined(false); // 방을 떠난 상태로 업데이트
                    setRoomName('');     // 방 이름 초기화
                    setToken('');        // 토큰 초기화
                }}> 방 나가기 </ DisconnectButton >
                <button
                    onClick={toggleChat}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#282929',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {isChatVisible ? <CloseIcon size={24} /> : <ChatIcon size={24} />}
                </button>

                {isChatVisible && (
                    <div style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '20px',
                        width: '20%',
                        height: '80%',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                    }}>
                        <ChatComponent />
                    </div>
                )}
            </LiveKitRoom>
        </div>
    );
}

function MyVideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}
