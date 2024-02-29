// 이메일, 연락처 input 태그 readOnly
document.querySelector('.email').readOnly = true;
document.querySelector('.tel').readOnly = true;

// input 감싸고 있는 박스
const passwordBox = document.querySelector('.password-box');
const passwordConfirmBox = document.querySelector('.confirm-box');
const userNameBox = document.querySelector('.name-box');
const addressBox = document.querySelector('.address-box');
const addressDetailBox = document.querySelector('.detail-box');
const borderBox = document.querySelectorAll('.border-box');

// input
const email = document.querySelector('.email');
const userName = document.querySelector('.name');
const phoneNumber = document.querySelector('.tel');
const address = document.querySelector('.address');
const addressDetail = document.querySelector('.detail');
const password = document.querySelector('.password');
const passwordConfirm = document.querySelector('.confirm');

// 우편번호 찾기, 주소 입력
const postalCodeBox = document.querySelector('.wrap');
const foldButton = document.querySelector('.fold-button');
let postalCodeVal = '';

// 확인 버튼
const modifyButton = document.querySelector('.modify-button');

// 회원정보 불러오기 GET
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        fetch('http://localhost:3000/api/v1/user/mypage', {
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
                postalCodeVal = res.data.postal_code;
                address.value = res.data.address;
                addressDetail.value = res.data.address_detail;
            })
    }
    else {
        alert('올바른 접근이 아닙니다.');
        location.href = '/user/login.html';
    }
})

// 우편번호 찾기
addressBox.addEventListener('click', () => {
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
            postalCodeVal = data.zonecode;
            document.querySelector(".address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.querySelector(".detail").focus();

            // border color가 red로 표시되어있을 경우 기본값으로 변경
            if (addressBox.classList.contains('on')) {
                addressBox.removeChild(addressBox.lastChild);
                addressBox.classList.remove('on');
            }

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            postalCodeBox.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            postalCodeBox.style.height = size.height + 'px';
            postalCodeBox.style.maxHeight = '466px';
        },
        width: '100%',
        height: '100%'
    }).embed(postalCodeBox);

    // iframe을 넣은 element를 보이게 한다.
    postalCodeBox.style.display = 'block';
})

// 우편번호 찾기 닫기
foldButton.addEventListener('click', () => {
    // iframe을 넣은 element를 안보이게 한다.
    postalCodeBox.style.display = 'none';
})

// 회원정보 수정 PATCH
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
        if (passwordVal && !passwordConfirmVal) {
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

    // 유효성 검사 모두 통과할 경우 PATCH
    // 비밀번호 변경할 경우
    if (passwordVal) {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            fetch('http://localhost:3000/api/v1/user/mypage', {
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
                    if (res.error) alert('정보 수정에 실패했습니다. 정보를 다시 확인해주세요.');
                    else {
                        alert('정보 수정이 완료되었습니다.')
                        location.href = '/index.html';
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            alert('올바른 접근이 아닙니다.');
            location.href = '/user/login.html';
        }
    }
    // 비밀번호 변경하지 않을 경우
    else {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            fetch('http://localhost:3000/api/v1/user/mypage', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${jwt}`
                },
                body: JSON.stringify({
                    user_name: userNameVal,
                    postal_code: postalCodeVal,
                    address: addressVal,
                    address_detail: addressDetailVal
                }),
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.error) alert('정보 수정에 실패했습니다. 정보를 다시 확인해주세요.');
                    else {
                        alert('정보 수정이 완료되었습니다.')
                        location.href = '/index.html';
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            alert('올바른 접근이 아닙니다.');
            location.href = '/user/login.html';
        }
    }
})