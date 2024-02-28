// 이메일, 이름, 연락처 input 태그 readOnly
document.querySelector('.email').readOnly = true;
document.querySelector('.tel').readOnly = true;

const email = document.querySelector('.email');
const userName = document.querySelector('.name');
const phoneNumber = document.querySelector('.tel');
const address = document.querySelector('.address');
const addressDetail = document.querySelector('.detail');
const password = document.querySelector('.password');
const passwordConfirm = document.querySelector('.confirm');
const modifyButton = document.querySelector('.modify-button');
let userId = ''; // let 으로 선언하는거 맞는지? 로그아웃 후 다른 아이디로 로그인하는 경우도 있으니...?

// 회원정보 불러오기
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        fetch('http://localhost:8081/api/v1/user/mypage', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `${jwt}`
            }
        }).then(res => res.json())
            .then(res => {
                email.value = res.data.email;
                userName.value = res.data.user_name;
                phoneNumber.value = res.data.phone_number;
                address.value = res.data.address;
                addressDetail.value = res.data.address_detail;
                userId = res.data._id;
            })
    }
})

modifyButton.addEventListener('click', e => {
    e.preventDefault();

    const passwordVal = password.value;
    const passwordConfirmVal = passwordConfirm.value;
    const userNameVal = userName.value;
    const addressVal = address.value;
    const addressDetailVal = addressDetail.value;

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

    // 새 비밀번호 입력값 여부 확인
    if (passwordVal) {
        // 새 비밀번호 유효성 검사
        if (!passwordPattern.test(passwordVal)) {
            // '최소 8글자 이상, 숫자 포함 필수'
        }
    }

    // 새 비밀번호 입력값이 없을 경우 PATCH
    // fetch('http://localhost:8081/api/v1/user/mypage', {
    //     method: 'GET',
    //     headers: {
    //         "Content-Type": "application/json",
    //         "authorization": `${jwt}`
    //     }
    // })


})
