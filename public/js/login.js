import { API_URL } from "/public/js/constants.js";

// input 감싸고 있는 박스
const emailBox = document.querySelector('.email-box');
const passwordBox = document.querySelector('.password-box');
const borderBox = document.querySelectorAll('.border-box');

// input
const email = document.querySelector('.email');
const password = document.querySelector('.password');

// 로그인 버튼
const loginButton = document.querySelector('.login-button');

// 로그인 버튼 클릭
loginButton.addEventListener('click', e => setLogin(e));

// 엔터
email.addEventListener('keyup', e => { if (e.keyCode === 13) setLogin(e) });
password.addEventListener('keyup', e => { if (e.keyCode === 13) setLogin(e) });

// 로그인 POST
function setLogin(e) {
    const emailVal = email.value;
    const passwordVal = password.value;

    const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

    // 이메일 유효성 검사
    if (!emailVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!emailBox.classList.contains('on')) {
            emailBox.classList.add('on');
            emailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>이메일을 입력하세요.</p></div');
        }
        return false;
    }
    if (!emailPattern.test(emailVal)) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!emailBox.classList.contains('on')) {
            emailBox.classList.add('on');
            emailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>올바른 이메일 형식이 아닙니다.</p></div');
        }
        return false;
    }

    // 비밀번호 입력값이 없을 경우
    if (!passwordVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!passwordBox.classList.contains('on')) {
            passwordBox.classList.add('on');
            passwordBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호를 입력하세요.</p></div');
        }
        return false;
    }

    // 입력값 문제없을 경우 border color가 red인 박스가 있다면 모두 기본값으로 변경
    borderBox.forEach(e => {
        if (e.classList.contains('on')) {
            e.removeChild(e.lastChild);
            e.classList.remove('on');
        }
    })

    // 아이디, 비밀번호 입력값이 모두 있을 경우 로그인 정보 POST
    fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailVal,
            password: passwordVal,
        }),
    }).then(res => res.json())
        .then(res => {
            if (res.error === '이메일 또는 비밀번호를 다시 확인해주세요') {
                alert('잘못된 이메일 또는 비밀번호입니다.');
                return false;
            }

            if (res.error) {
                alert('로그인 정보를 불러올 수 없습니다. 고객센터 또는 카카오톡 채널로 문의해주세요.');
                location.href = '/index.html';
                return false;
            }

            if (!res.error) {
                localStorage.setItem("jwt", res.data);
                location.href = '/index.html';
                return false;
            }
        })
}