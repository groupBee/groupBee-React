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
    const [roomName, setRoomName] = useState('');  // 방 이름 상태
    const [participantName, setParticipantName] = useState('');  // 사용자 이름 상태
    const [hasJoined, setHasJoined] = useState(false);  // 사용자가 방에 참여했는지 여부
    const [infoData, setInfoData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employee/info');
            const data = await response.json();
            setInfoData(data);
            console.log(data)


        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (infoData && infoData.name) {
            setParticipantName(infoData.name);  // infoData에서 이름을 가져와 설정
        }
    }, [infoData]);  // infoData가 변경될 때마다 실행

    useEffect(() => {
        fetchData();  // 컴포넌트가 로드될 때 fetchData 호출
    }, []);

    // roomName이 변경될 때만 fetchToken 호출
    useEffect(() => {
        if (hasJoined && roomName) {
            fetchToken();
        }
    }, [roomName]); // roomName이 변경될 때만 호출

    const fetchToken = async () => {
        try {
            const token = await generateToken(roomName, participantName);  // 초대 코드로 토큰 생성
            setToken(token);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleJoinRoom = () => {
        if (roomName.trim() && participantName.trim()) {
            const generatedInviteCode = generateRandomCode(8);  // 8자리 랜덤 코드 생성
            setRoomName(generatedInviteCode);  // 초대 코드 설정
            fetchToken();  // 토큰 가져오기
            setHasJoined(true);  // 방에 참여 상태로 변경
            console.log('UUID : '+generatedInviteCode)
            console.log('UUID : '+roomName)
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
                    <button
                        onClick={handleJoinRoom}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#ffb121',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        입장하기
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
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={serverUrl}
                data-lk-theme="default"
                style={{height: '100vh'}}
            >
                <MyVideoConference/>
                <RoomAudioRenderer/>
                <ControlBar/>
            </LiveKitRoom>
            <div style={{
                padding: '10px',
                backgroundColor: '#f1f1f1',
                textAlign: 'center',
                fontSize: '16px',
                borderTop: '1px solid #ccc'
            }}>
                초대 코드: <strong>{roomName}</strong>
            </div>
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
            <GridLayout tracks={tracks} style={{height: 'calc(100vh - var(--lk-control-bar-height))'}}>
            <ParticipantTile/>
        </GridLayout>
    );
}
