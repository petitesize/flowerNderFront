const email = document.querySelector('');
const password = document.querySelector('');
const passwordConfirm = document.querySelector('');
const userName = document.querySelector('');
const phoneNumber = document.querySelector('');
const address = document.querySelector('');
const addressDetail = document.querySelector('');
const signUpButton = document.querySelector('');

signUpButton.addEventListener('click', e => {
    e.preventDefault();
    // 이메일 형식 검사

        // 이메일 형식이 아닐 경우 > '이메일을 정확히 입력하세요', border red
        // 이메일 형식일 경우 > 체크 박스 표시

    // 비밀번호 형식 검사 (최소 8글자 이상, 숫자 포함 필수)

        // 비밀번호가 8글자 미만 or 숫자 포함하지 않을 경우 > '최소 8글자 이상, 숫자 포함 필수', border red

    // 비밀번호 - 비밀번호 확인 일치 검사
       // 일치하지 않을 경우 > '비밀번호가 일치하지 않습니다', border red
       
    
    // 값이 없을 경우 '비밀번호를 입력하세요', border red
    // '비밀번호를 한번 더 입력하세요' '주소를 입력하세요' '상세 주소를 입력하세요'
})