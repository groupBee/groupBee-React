import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
    id: '',
    passwd: '',
    isLogined: false,
    loginTime: null,
    expirationTime: null,

    setId: (id) => set({ id }), // 아이디 입력
    setPasswd: (passwd) => set({ passwd }), // 비밀번호 입력

    login: async () => {

        try {
            const { id, passwd } = useStore.getState(); // id, password 가져오기
            const json = JSON.stringify({ id, passwd });
            const blob = new Blob([json], { type: 'application/json' }); // 타입 추가
            const data = new FormData();
            data.append('data', blob);

            const response = await axios({
                method: 'post',
                url: '/api/employee/auth/login',
                data: data,
            });

            if (response.status === 200) {
                console.log('로그인 성공', response.data);
                const now = new Date();
                const expirationTime = now.getTime() + 30 * 60 * 1000; // 30분 후 만료 시간
                set({
                    isLogined: true,
                    loginTime: now,
                    expirationTime: expirationTime
                });
                localStorage.setItem('loginData', JSON.stringify({
                    isLogined: true,
                    loginTime: now.getTime(), // 밀리초로 저장
                    expirationTime: expirationTime,
                    id: id,
                    passwd: passwd // 비밀번호도 저장할 수 있지만 보안에 주의 필요
                }));

                // 로그인 경과 시간 출력
                console.log(`로그인 시간: ${now.toLocaleString()}`);
                console.log(`로그인 시점에서 현재까지 경과된 시간: ${(now.getTime() - now.getTime()) / 1000}초`);



            } else {
                console.log('로그인 실패: 알 수 없는 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        console.log('로그인 실패: 존재하지 않는 ID입니다.');
                        break;
                    case 402:
                        console.log('로그인 실패: 비밀번호가 틀렸습니다.');
                        break;
                    default:
                        console.log('로그인 실패: 요청 중 오류 발생');
                        break;
                }
            } else {
                console.log('로그인 실패: 요청 중 오류 발생');
            }
            console.error('로그인 실패:', error);
        } finally {

        }
    },

    logout: async () => {
        try {
            const response = await axios.post('/api/employee/auth/logout'); // 로그아웃 요청
            if (response.status === 200) {
                console.log('로그아웃 성공', response.data);
                set({
                    isLogined: false,
                    id: '',
                    passwd: '',
                    loginTime: null,
                    expirationTime: null
                }); // 로그아웃 시 상태 초기화
                localStorage.removeItem('loginData'); // localStorage에서도 상태 삭제
            } else {
                console.log('로그아웃 실패: 알 수 없는 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    }
}));

// 상태를 초기화하는 헬퍼 함수
const initializeAuth = () => {
    const savedData = localStorage.getItem('loginData');
    if (savedData) {
        const { isLogined, loginTime, expirationTime, id } = JSON.parse(savedData);
        const now = Date.now();

        if (isLogined && now < expirationTime) {
            useStore.setState({
                isLogined,
                loginTime: new Date(loginTime), // 밀리초 값을 Date 객체로 변환
                expirationTime,
                id
            });

            // 로그인 경과 시간 출력
            console.log(`로그인 시간: ${new Date(loginTime).toLocaleString()}`);
            console.log(`현재 시간: ${new Date().toLocaleString()}`);
            console.log(`로그인 시점에서 현재까지 경과된 시간: ${((now - loginTime) / 1000).toFixed(2)}초`);
        } else {
            useStore.setState({
                isLogined: false,
                expirationTime: null
            });
            localStorage.removeItem('loginData');
        }
    }
};

// 앱 시작 시 호출
initializeAuth();

export default useStore;
