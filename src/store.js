import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
    id: '',
    passwd: '',
    isLogined: false,
    isAdmin: false,


    setId: (id) => set({ id }),
    setPasswd: (passwd) => set({ passwd }),

    login: async () => {
        try {
            const { id, passwd } = useStore.getState();
            const json = JSON.stringify({ id, passwd });
            const blob = new Blob([json], { type: 'application/json' });
            const data = new FormData();
            data.append('data', blob);

            const response = await axios({
                method: 'post',
                url: '/api/employee/auth/login',
                data: data,
            });

            if (response.status === 200) {
                console.log('로그인 성공', response.data);

                const { isAdmin } = response.data;

                set({
                    isLogined: true,
                    isAdmin
                });

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
        }
    },

    logout: async () => {
        try {
            const response = await axios.post('/api/employee/auth/logout');
            if (response.status === 200) {
                console.log('로그아웃 성공', response.data);
                set({
                    isLogined: false,
                    id: '',
                    passwd: '',
                    isAdmin: false
                });
            } else {
                console.log('로그아웃 실패: 알 수 없는 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    },

    // 페이지 로드 시 서버에서 로그인 상태 확인
    initializeState: async () => {
        try {
            const response = await axios.get('/api/employee/auth/islogin');
            if (response.status === 200) {
                const { isAdmin } = response.data;
                set({
                    isLogined: true,
                    isAdmin
                });
                console.log('새로고침해서 데이터를 받아왔습니다.');
            } else if (response.status === 400) {
                // 응답이 400인 경우 상태를 초기화합니다.
                set({
                    isLogined: false,
                    id: '',
                    passwd: '',
                    isAdmin: false
                });
            }
        } catch (error) {
            console.error('로그인 상태 확인 실패:', error);
            // 요청 실패 시 상태를 초기화합니다.
            set({
                isLogined: false,
                id: '',
                passwd: '',
                isAdmin: false
            });
        }
    }
}));

// 페이지가 로드될 때 서버에서 상태를 초기화합니다.
useStore.getState().initializeState();

export default useStore;
