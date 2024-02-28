// import { API_URL } from '/public/js/constants.js'

const email = document.querySelector('.email');
const password = document.querySelector('.password');
const loginButton = document.querySelector('.login-button');

loginButton.addEventListener('click', e => {
    e.preventDefault();

    const emailVal = email.value;
    const passwordVal = password.value;

    // 이메일 입력값이 없을 경우
    if (!emailVal) {
        alert('아이디를 입력하세요.');
        return false;
    }

    // 비밀번호 입력값이 없을 경우
    if (!passwordVal) {
        alert('비밀번호를 입력하세요.');
        return false;
    }

    // 아이디, 비밀번호 입력값이 모두 있을 경우 로그인 정보 POST
    fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailVal,
            password: passwordVal,
        }),
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.error) alert('잘못된 아이디 또는 비밀번호입니다.');
            else {
                localStorage.setItem("jwt", res.data);
                location.href = '/index.html';
            }
        })
        .catch(err => console.log(err))
})