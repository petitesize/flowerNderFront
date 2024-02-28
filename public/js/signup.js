const emailBox = document.querySelector('.email-box');
const passwordBox = document.querySelector('.password-box');
const passwordConfirmBox = document.querySelector('.confirm-box');
const userNameBox = document.querySelector('.name-box');
const phoneNumberBox = document.querySelector('.tel-box');
const addressBox = document.querySelector('.address-box');
const addressDetailBox = document.querySelector('.detail-box');
const borderBox = document.querySelectorAll('.border-box');

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
    const phoneNumberPattern = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/

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
    if (!passwordPattern.test(passwordVal)) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!passwordBox.classList.contains('on')) {
            passwordBox.classList.add('on');
            passwordBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>최소 8글자 이상, 영어·숫자 포함 필수</p></div');
        }
        return false;
    }
    if (!passwordConfirmVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.classList.add('on');
            passwordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호를 한번 더 입력하세요.</p></div');
        }
        return false;
    }
    if (passwordVal !== passwordConfirmVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!passwordConfirmBox.classList.contains('on')) {
            passwordConfirmBox.classList.add('on');
            passwordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호가 일치하지 않습니다.</p></div');
        }
        return false;
    }

    // 이름
    if (!userNameVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!userNameBox.classList.contains('on')) {
            userNameBox.classList.add('on');
            userNameBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>이름을 입력하세요.</p></div');
        }
        return false;
    }

    // 연락처 유효성 검사
    if (!phoneNumberVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.classList.add('on');
            phoneNumberBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>휴대폰 번호를 입력하세요.</p></div');
        }
        return false;
    }
    if (!phoneNumberPattern.test(phoneNumberVal)) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!phoneNumberBox.classList.contains('on')) {
            phoneNumberBox.classList.add('on');
            phoneNumberBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>(-)을 포함한 휴대폰 번호를 입력하세요.</p></div');
        }
        return false;
    }

    // 주소
    if (!addressVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!addressBox.classList.contains('on')) {
            addressBox.classList.add('on');
            addressBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>주소를 입력하세요.</p></div');
        }
        return false;
    }
    if (!addressDetailVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!addressDetailBox.classList.contains('on')) {
            addressDetailBox.classList.add('on');
            addressDetailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>주소를 입력하세요.</p></div');
        }
        return false;
    }

    // 유효성 검사 모두 통과한 후 border color가 red인 박스가 있다면 모두 기본값으로 변경
    borderBox.forEach(e => {
        if (e.classList.contains('on')) {
            e.removeChild(e.lastChild);
            e.classList.remove('on');
        }
    })

    fetch('http://localhost:3000/api/v1/auth/signup', {
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
                console.log(res.error);
                alert('가입이 완료되었습니다. 로그인해주세요.')
                location.href = '/user/login.html';
            }
        })
        .catch(err => console.log(err))
})