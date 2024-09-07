import React, { useEffect, useState } from 'react';
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { generateToken } from './livekit'; // 토큰 생성 함수

const serverUrl = 'https://openvidu.groupbee.co.kr';

export default function VideoConference() {
    const [token, setToken] = useState('');
    const [roomName, setRoomName] = useState('');  // 방 이름 상태
    const [participantName, setParticipantName] = useState('');  // 사용자 이름 상태
    const [hasJoined, setHasJoined] = useState(false);  // 사용자가 방에 참여했는지 여부

    const fetchToken = async () => {
        try {
            const token = await generateToken(roomName, participantName);  // 입력값으로 토큰 생성
            setToken(token);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleJoinRoom = () => {
        if (roomName.trim() && participantName.trim()) {
            fetchToken();
            setHasJoined(true);  // 방에 참여 상태로 변경
        } else {
            alert("방 이름과 사용자 이름을 입력하세요.");
        }
    };

    // 방에 참여하기 전 입력 필드와 버튼을 표시
    if (!hasJoined) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>화상회의 참여</h2>
                <div>
                    <input
                        type="text"
                        placeholder="방 이름 입력"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="사용자 이름 입력"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <div>
                    <button
                        onClick={handleJoinRoom}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        방생성하기
                    </button>
                </div>
            </div>
        );
    }

    // 토큰이 로딩 중일 때 표시할 내용
    if (!token) {
        return <div>Loading...</div>;
    }

    // 방에 참여 후 LiveKitRoom 컴포넌트 렌더링
    return (
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
            <ControlBar />
        </LiveKitRoom>
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
