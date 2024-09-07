import { AccessToken } from 'livekit-server-sdk';

// 직접 API 키와 비밀 키를 코드에 작성
const API_KEY = 'APIFHHoWWxJ9wgo';
const SECRET_KEY = 'eCTKVKFy88atyolGfq4lbEF9AVwvRmtFysMgKMqSP3t';

export const generateToken = async (roomName, participantName) => {
    try {
        const at = new AccessToken(API_KEY, SECRET_KEY, {
            identity: participantName,
        });
        at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

        const token = await at.toJwt();
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};
