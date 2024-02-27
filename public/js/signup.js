const emailBox = document.querySelector('.email-box');
const passwordBox = document.querySelector('.password-box');
const passwordConfirmBox = document.querySelector('.confirm-box');
const nameBox = document.querySelector('.name-box');
const phoneNumberBox = document.querySelector('.tel-box');
const addressBox = document.querySelector('.address-box');
const addressDetailBox = document.querySelector('.detail-box');

const email = document.querySelector('.email');
const password = document.querySelector('.password');
const passwordConfirm = document.querySelector('.confirm');
const userName = document.querySelector('.name');
const phoneNumber = document.querySelector('.tel');
const address = document.querySelector('.address');
const addressDetail = document.querySelector('.detail');
const signUpButton = document.querySelector('.signup-button');

signUpButton.addEventListener('click', e => {
    e.preventDefault();

    const emailVal = email.value;
    const passwordVal = password.value;
    const passwordConfirmVal = passwordConfirm.value;
    const userNameVal = userName.value;
    const phoneNumberVal = phoneNumber.value;
    const addressVal = address.value;
    const addressDetailVal = addressDetail.value;

    const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    const passwordPattern = '';
    const phoneNumberPattern = '';

    // 이메일 유효성 검사
    if (!emailVal || !emailPattern.test(emailVal)) {
        console.log(emailPattern.test(emailVal));
        console.log(email.value);
        if (!emailBox.classList.contains('on')) {
            emailBox.classList.add('on');
            passwordBox.style = 'border-top: 0px';
            emailBox.style = 'height: 56px';
            emailBox.innerHTML += '<div><p class="check-font">이메일을 정확히 입력하세요</p></div>';
            console.log('on ---');
        }
        
    }

    // 비밀번호 유효성 검사
    else if (!passwordVal) {
        if (!passwordBox.classList.contains('on')) {
            passwordBox.classList.add('on');
            passwordConfirmBox.style = 'border-top: 0px';
            passwordBox.style = 'height: 56px';
            passwordBox.innerHTML += '<div><p class="check-font">비밀번호를 입력하세요.</p></div>';
        }
    }
    else if (!passwordPattern.test(passwordVal)) {

    }
    else if (!passwordConfirmVal) {

    }
    else if (passwordVal !== passwordConfirmVal) {

    }
    else if (!userNameVal) {

    }
    else if (!phoneNumberVal) {

    }
    else if (!phoneNumberPattern.test(phoneNumberVal)) {

    }
    else if (!addressVal) {

    }
    else if (!addressDetailVal) {

    }


    // 비밀번호 형식 검사 (최소 8글자 이상, 숫자 포함 필수)

    // 비밀번호가 8글자 미만 or 숫자 포함하지 않을 경우 > '최소 8글자 이상, 숫자 포함 필수', border red

    // 비밀번호 - 비밀번호 확인 일치 검사
    // 일치하지 않을 경우 > '비밀번호가 일치하지 않습니다', border red


    // 값이 없을 경우 '비밀번호를 입력하세요', border red
    // '비밀번호를 한번 더 입력하세요' '주소를 입력하세요' '상세 주소를 입력하세요'
})