import { API_URL } from "/public/js/constants.js";

// 회원탈퇴
const deleteBox = document.querySelector('.delete');

// input 감싸고 있는 박스
const passwordBox = document.querySelector('.password-box');
const newPasswordBox = document.querySelector('.new-box');
const newPasswordConfirmBox = document.querySelector('.confirm-box');
const userNameBox = document.querySelector('.name-box');
const postalCodeBox = document.querySelector('.postal-box');
const addressBox = document.querySelector('.address-box');
const addressDetailBox = document.querySelector('.detail-box');
const borderBox = document.querySelectorAll('.border-box');

// input
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const newPassword = document.querySelector('.new-password');
const newPasswordConfirm = document.querySelector('.confirm');
const userName = document.querySelector('.name');
const phoneNumber = document.querySelector('.tel');
const postalCode = document.querySelector('.postal-code');
const address = document.querySelector('.address');
const addressDetail = document.querySelector('.detail');

// 우편번호 찾기, 주소 입력
const searchPostalCodeBox = document.querySelector('.wrap');
const foldButton = document.querySelector('.fold-button');

// 확인 버튼
const modifyButton = document.querySelector('.modify-button');

// 이메일, 연락처, 우편번호, 주소 input 태그 readOnly
email.readOnly = true;
phoneNumber.readOnly = true;
postalCode.readOnly = true;
address.readOnly = true;

// 회원정보 불러오기 GET
window.addEventListener('load', () => {
    if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        fetch(`${API_URL}user/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `${jwt}`
            }
        }).then(res => res.json())
            .then(res => {
                if (res.error === 'jwt expired') {
                    localStorage.removeItem('jwt');
                    alert('로그인 인증이 만료되었습니다.');
                    location.href = '/user/login.html';
                    return false;
                }

                if (res.error) {
                    alert('회원정보를 불러올 수 없습니다. 고객센터 또는 카카오톡 채널로 문의해주세요.');
                    location.href = '/index.html';
                    return false;
                }

                if (!res.error) {
                    email.value = res.data.email;
                    userName.value = res.data.user_name;
                    phoneNumber.value = res.data.phone_number;
                    postalCode.value = res.data.postal_code;
                    address.value = res.data.address;
                    addressDetail.value = res.data.address_detail;
                    return false
                }
            })
    }
    else {
        alert('로그인 인증이 만료되었습니다.');
        location.href = '/user/login.html';
    }
})

// 우편번호 찾기
postalCodeBox.addEventListener('click', () => {
    // 현재 scroll 위치를 저장해놓는다.
    const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new daum.Postcode({
        oncomplete: function (data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.querySelector('.postal-code').value = data.zonecode;
            document.querySelector('.address').value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.querySelector('.detail').focus();

            // border color가 red로 표시되어있을 경우 기본값으로 변경
            if (postalCodeBox.classList.contains('on')) {
                postalCodeBox.removeChild(addressBox.lastChild);
                postalCodeBox.classList.remove('on');
            }
            if (addressBox.classList.contains('on')) {
                addressBox.removeChild(addressBox.lastChild);
                addressBox.classList.remove('on');
            }

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            searchPostalCodeBox.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            searchPostalCodeBox.style.height = size.height + 'px';
            searchPostalCodeBox.style.maxHeight = '466px';
        },
        width: '100%',
        height: '100%'
    }).embed(searchPostalCodeBox);

    // iframe을 넣은 element를 보이게 한다.
    searchPostalCodeBox.style.display = 'block';
})

// 우편번호 찾기 닫기
foldButton.addEventListener('click', () => {
    // iframe을 넣은 element를 안보이게 한다.
    searchPostalCodeBox.style.display = 'none';
})

// 확인 버튼 클릭
modifyButton.addEventListener('click', e => setUserInfo(e));

// 엔터
userName.addEventListener('keyup', e => { if (e.keyCode === 13) setUserInfo(e) });
password.addEventListener('keyup', e => { if (e.keyCode === 13) setUserInfo(e) });
newPassword.addEventListener('keyup', e => { if (e.keyCode === 13) setUserInfo(e) });
newPasswordConfirm.addEventListener('keyup', e => { if (e.keyCode === 13) setUserInfo(e) });
addressDetail.addEventListener('keyup', e => { if (e.keyCode === 13) setUserInfo(e) });

// 회원정보 PATCH
function setUserInfo(e) {
    e.preventDefault();

    const passwordVal = password.value;
    const newPasswordVal = newPassword.value;
    const newPasswordConfirmVal = newPasswordConfirm.value;
    const userNameVal = userName.value;
    const postalCodeVal = postalCode.value;
    const addressVal = address.value;
    const addressDetailVal = addressDetail.value;

    const newPasswordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

    // 기존 비밀번호
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

    // 새 비밀번호 입력값 여부 확인
    if (newPasswordVal) {
        // 새 비밀번호 유효성 검사
        if (!newPasswordPattern.test(newPasswordVal)) {
            borderBox.forEach(e => {
                if (e.classList.contains('on')) {
                    e.removeChild(e.lastChild);
                    e.classList.remove('on');
                }
            })

            if (!newPasswordBox.classList.contains('on')) {
                newPasswordBox.classList.add('on');
                newPasswordBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>최소 8글자 이상, 영어·숫자 포함 필수</p></div');
            }
            return false;
        }
        if (newPasswordVal && !newPasswordConfirmVal) {
            borderBox.forEach(e => {
                if (e.classList.contains('on')) {
                    e.removeChild(e.lastChild);
                    e.classList.remove('on');
                }
            })

            if (!newPasswordConfirmBox.classList.contains('on')) {
                newPasswordConfirmBox.classList.add('on');
                newPasswordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호를 한번 더 입력하세요.</p></div');
            }
            return false;
        }
        if (newPasswordVal !== newPasswordConfirmVal) {
            borderBox.forEach(e => {
                if (e.classList.contains('on')) {
                    e.removeChild(e.lastChild);
                    e.classList.remove('on');
                }
            })

            if (!newPasswordConfirmBox.classList.contains('on')) {
                newPasswordConfirmBox.classList.add('on');
                newPasswordConfirmBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>비밀번호가 일치하지 않습니다.</p></div');
            }
            return false;
        }
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

    // 우편번호 + 주소
    if (!postalCodeVal || !addressVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!postalCodeBox.classList.contains('on')) {
            postalCodeBox.classList.add('on');
            postalCodeBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>우편번호를 입력하세요.</p></div');
        }
        if (!addressBox.classList.contains('on')) {
            addressBox.classList.add('on');
            addressBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>주소를 입력하세요.</p></div');
        }
        return false;
    }

    // 상세주소
    if (!addressDetailVal) {
        borderBox.forEach(e => {
            if (e.classList.contains('on')) {
                e.removeChild(e.lastChild);
                e.classList.remove('on');
            }
        })

        if (!addressDetailBox.classList.contains('on')) {
            addressDetailBox.classList.add('on');
            addressDetailBox.insertAdjacentHTML('beforeend', '<div class="check-font"><p>상세주소를 입력하세요.</p></div');
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

    // 유효성 검사 모두 통과할 경우 PATCH
    // 비밀번호 변경할 경우
    if (passwordVal) {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            fetch(`${API_URL}user/me`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${jwt}`
                },
                body: JSON.stringify({
                    password: passwordVal,
                    new_password: newPasswordVal,
                    user_name: userNameVal,
                    postal_code: postalCodeVal,
                    address: addressVal,
                    address_detail: addressDetailVal
                }),
            }).then(res => res.json())
                .then(res => {
                    if (res.error === 'jwt expired') {
                        localStorage.removeItem('jwt');
                        alert('로그인 인증이 만료되었습니다.');
                        location.href = '/user/login.html';
                        return false;
                    }

                    if (res.error === '비밀번호를 다시 확인해주세요') {
                        alert('기존 비밀번호를 다시 확인하세요.');
                        return false;
                    }

                    if (!res.error) {
                        alert('회원정보 수정이 성공적으로 완료되었습니다.');
                        location.href = '/orders/orderlist.html';
                        return false;
                    }
                })
        }
        else {
            alert('로그인 인증이 만료되었습니다.');
            location.href = '/user/login.html';
        }
    }
    // 비밀번호 변경하지 않을 경우
    else {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            fetch(`${API_URL}user/me`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${jwt}`
                },
                body: JSON.stringify({
                    password: passwordVal,
                    user_name: userNameVal,
                    postal_code: postalCodeVal,
                    address: addressVal,
                    address_detail: addressDetailVal
                }),
            }).then(res => res.json())
                .then(res => {
                    if (res.error === 'jwt expired') {
                        localStorage.removeItem('jwt');
                        alert('로그인 인증이 만료되었습니다.');
                        location.href = '/user/login.html';
                        return false;
                    }

                    if (res.error === '비밀번호를 다시 확인해주세요') {
                        alert('기존 비밀번호를 다시 확인하세요.');
                        return false;
                    }

                    if (!res.error) {
                        alert('회원정보 수정이 성공적으로 완료되었습니다.');
                        location.href = '/orders/orderlist.html';
                        return false;
                    }
                })
        }
        else {
            alert('로그인 인증이 만료되었습니다.');
            location.href = '/user/login.html';
        }
    }
}

deleteBox.addEventListener('click', () => {
    if (confirm('가입된 회원정보가 모두 삭제되며 복구되지 않습니다. 회원 탈퇴를 진행하시겠습니까?')) {
        // 주문조회
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            fetch(`${API_URL}user/order`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${jwt}`
                }
            }).then(res => res.json())
                .then(res => {
                    // 에러 있을 경우
                    if (res.error === 'jwt expired') {
                        localStorage.removeItem('jwt');
                        alert('로그인 인증이 만료되었습니다.');
                        location.href = '/user/login.html';
                        return false;
                    }

                    if (res.error) {
                        alert('회원정보를 불러올 수 없습니다. 고객센터 또는 카카오톡 채널로 문의해주세요.');
                        location.href = '/index.html';
                        return false;
                    }

                    // 에러 없을 경우
                    if (!res.error) {
                        // 주문조회 결과 주문내역이 없을 경우 회원탈퇴 진행
                        if (!res.data) deleteAccount(jwt);

                        // 주문조회 결과 주문내역이 있을 경우
                        if (res.data) {
                            res.data.forEach(e => {
                                // '배송완료'를 제외한 주문이 있을 경우 회원탈퇴 불가
                                if (e.order_status !== '배송완료') {
                                    alert('진행중인 주문이 있어 회원탈퇴가 불가합니다.');
                                    location.href = '/index.html';
                                    return false;
                                }
                            })
                            deleteAccount(jwt);
                        }
                    }
                })
        }
    }
})

function deleteAccount(jwt) {
    fetch(`${API_URL}user/me`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "authorization": `${jwt}`
        }
    }).then(res => res.json())
        .then(res => {
            if (res.error === 'jwt expired') {
                localStorage.removeItem('jwt');
                alert('로그인 인증이 만료되었습니다.');
                location.href = '/user/login.html';
                return false;
            }

            if (res.error) {
                alert('회원정보를 불러올 수 없습니다. 고객센터 또는 카카오톡 채널로 문의해주세요.');
                location.href = '/index.html';
                return false;
            }

            if (!res.error) {
                localStorage.removeItem('jwt');
                alert('회원탈퇴가 정상적으로 완료되었습니다.');
                location.href = '/index.html';
                return false;
            }
        })
}