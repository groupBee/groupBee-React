# GROUPBEE REACT

## ☘️ 1. 로그인
---
#### 1.1 Zustand 사용
<img src="https://velog.velcdn.com/images/woong2/post/dac868da-f556-4d1a-85fe-fba839ebf716/image.png" style="width: 100%; height: auto;" alt="로그인 이미지">

**Zustand** 상태 관리 라이브러리를 사용하여 서버로 아이디와 패스워드를 전송하고, 입력한 정보가 올바를 경우 **세션을 발급받아** 로그인 상태를 유지하는 방식을 사용했습니다.

---
#### 1.2 상태코드

<div style="display: flex; justify-content: space-between;">
  <img src="https://velog.velcdn.com/images/woong2/post/5afa2b11-a401-4844-a86e-4ca37a06431e/image.png" style="width: 50%; height: auto;" alt="이미지 1">
  <img src="https://velog.velcdn.com/images/woong2/post/edd09950-93b2-40d2-ab52-7474a29734d9/image.png" style="width: 50%; height: auto;" alt="이미지 2">
</div>

아이디와 패스워드를 서버로 전송한 후, 입력한 값의 유효성에 따라 상태 코드를 반환하여 오류 메시지를 구분합니다.

> 상태코드 200 : 로그인 성공

> 상태코드 401 : 존재하지 않는 ID입니다.

> 상태코드 402 : 비밀번호가 틀렸습니다.

 ---
#### 1.3 새로고침 시 상태관리 유지

로그인 상태를 Zustand 저장소에 저장 했을 경우 **새로고침 시 저장된 상태가 초기화되는 문제가 발생**하기 때문에, 새로고침 후에도 로그인 상태를 유지하기 위해 **발급된 세션을 다시 서버로 전송하여 유효한 세션이면 상태 코드 200을 반환**받고, 이를 통해 로그인 상태를 유지하는 방식을 사용하고 있습니다.
