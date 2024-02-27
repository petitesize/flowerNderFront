const emailBox = document.querySelector('.email-box');
const passwordBox = document.querySelector('.password-box');
const passwordConfirmBox = document.querySelector('.confirm-box');
const userNameBox = document.querySelector('.name-box');
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

    let emailVal = email.value;
    let passwordVal = password.value;
    let passwordConfirmVal = passwordConfirm.value;
    let userNameVal = userName.value;
    let phoneNumberVal = phoneNumber.value;
    let addressVal = address.value;
    let addressDetailVal = addressDetail.value;

    const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
    const phoneNumberPattern = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

    // 이메일 유효성 검사
    if (!emailVal || !emailPattern.test(emailVal)) {
        console.log('email 유효성 검사', emailPattern.test(emailVal));
        if (!emailBox.classList.contains('on')) {
            emailBox.classList.add('on');
            emailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>이메일을 정확히 입력하세요.</p></div');
        }
        return false;
    }

    // 비밀번호 유효성 검사
    if (!passwordVal) {
        if (emailBox.classList.contains('on')) {
            emailBox.removeChild(emailBox.lastChild);
            emailBox.classList.remove('on');
        }

        if (!passwordBox.classList.contains('on')) {
            passwordBox.classList.add('on');
            passwordBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호를 입력하세요.</p></div');
        }
        return false;
    }
    if (!passwordPattern.test(passwordVal)) {
        if (passwordBox.classList.contains('on')) {
            passwordBox.removeChild(passwordBox.lastChild);
            passwordBox.classList.remove('on');
        }

        if (!passwordBox.classList.contains('on')) {
            passwordBox.classList.add('on');
            passwordBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>최소 8글자 이상, 영어·숫자 포함 필수</p></div');
        }
        return false;
    }
    if (!passwordConfirmVal) {
        if (passwordBox.classList.contains('on')) {
            passwordBox.removeChild(passwordBox.lastChild);
            passwordBox.classList.remove('on');
        }

        if (!passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.classList.add('on');
            passwordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호를 한번 더 입력하세요.</p></div');
        }
        return false;
    }
    if (passwordVal !== passwordConfirmVal) {
        if (passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.removeChild(passwordConfirmBox.lastChild);
            passwordConfirmBox.classList.remove('on');
        }

        if (!passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.classList.add('on');
            passwordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호가 일치하지 않습니다.</p></div');
        }
        return false;
    }

    // 이름
    if (!userNameVal) {
        if (passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.removeChild(passwordConfirmBox.lastChild);
            passwordConfirmBox.classList.remove('on');
        }

        if (!userNameBox.classList.contains('on')) {
            userNameBox.classList.add('on');
            userNameBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>이름을 입력하세요.</p></div');
        }
        return false;
    }

    // 연락처 유효성 검사
    if (!phoneNumberVal) {
        if (userNameBox.classList.contains('on')) {
            userNameBox.removeChild(userNameBox.lastChild);
            userNameBox.classList.remove('on');
        }

        if (!phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.classList.add('on');
            phoneNumberBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>휴대폰 번호를 입력하세요.</p></div');
        }
        return false;
    }
    if (!phoneNumberPattern.test(phoneNumberVal)) {
        if (phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.removeChild(phoneNumberBox.lastChild);
            phoneNumberBox.classList.remove('on');
        }

        if (!phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.classList.add('on');
            phoneNumberBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>(-)을 포함한 휴대폰 번호를 입력하세요.</p></div');
        }
        return false;
    }

    // 주소
    if (!addressVal) {
        if (phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.removeChild(phoneNumberBox.lastChild);
            phoneNumberBox.classList.remove('on');
        }

        if (!addressBox.classList.contains('on')) {
            addressBox.classList.add('on');
            addressBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>주소를 입력하세요.</p></div');
        }
        return false;
    }
    if (!addressDetailVal) {
        if (addressBox.classList.contains('on')) {
            addressBox.removeChild(addressBox.lastChild);
            addressBox.classList.remove('on');
        }

        if (!addressDetailBox.classList.contains('on')) {
            addressDetailBox.classList.add('on');
            addressDetailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>주소를 입력하세요.</p></div');
        }
        return false;
    }

    fetch('http://localhost:8081/api/v1/auth/signup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailVal,
            password: passwordVal,
            user_name: userNameVal,
            phone_number: phoneNumberVal,
            address: addressVal,
            address_detail: addressDetailVal
        }),
    }).then(res => res.json())
        .then(res => {
            if (res.error) alert('이미 가입된 이메일입니다.');
            else {
                alert('가입이 완료되었습니다. 로그인해주세요.')
                location.href = '/user/login.html';
            }
        })
        .catch(err => console.log(err))



    // 비밀번호 형식 검사 (최소 8글자 이상, 숫자 포함 필수)


    // 비밀번호 - 비밀번호 확인 일치 검사
    // 일치하지 않을 경우 > '비밀번호가 일치하지 않습니다', border red


    // 값이 없을 경우 '비밀번호를 입력하세요', border red
    // '비밀번호를 한번 더 입력하세요' '주소를 입력하세요' '상세 주소를 입력하세요'
})