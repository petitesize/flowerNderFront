const email = document.querySelector('.email');
const password = document.querySelector('.password');
const loginButton = document.querySelector('.login-button');

loginButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('email: ', email.value);
    console.log('password: ', password.value);

    // 유저 정보가 일치하지 않을 경우 '잘못된 아이디 또는 비밀번호입니다.' alert
})