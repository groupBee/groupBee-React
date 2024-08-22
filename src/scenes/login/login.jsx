import React, {useEffect} from 'react';
import useStore from '../../store';
import './login.css';
import {useNavigate} from "react-router-dom";



const Login = () => {
    const { id, passwd,  isLogined, setId, setPasswd, login, logout } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogined) {
            navigate('/'); // 로그인 성공 시 홈 화면으로 이동
        }
    }, [isLogined, navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogined) {
            logout(); // 이미 로그인 상태인 경우 로그아웃
        } else {
            login(); // 로그인 상태가 아닌 경우 로그인

        }
    };

    return (
            <div className="wrapper">
                <div className="container">
                    <h1>Group Bee</h1>
                    <form onSubmit={handleSubmit}>
                        {!isLogined ? (
                            <>
                                <div>
                                    <label>ID : </label>
                                    <input
                                        type="text"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Password : </label>
                                    <input
                                        type="password"
                                        value={passwd}
                                        onChange={(e) => setPasswd(e.target.value)}
                                    />
                                </div>
                                <button type="submit" id="login-button">로그인</button>
                            </>
                        ) : (
                            <div>
                                <h3>안녕하세요, {id}님!</h3>
                                <button type="button" onClick={logout}>로그아웃</button>
                            </div>
                        )}
                    </form>
                </div>

                <ul className="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>

                </ul>
            </div>
    );
};

export default Login;
