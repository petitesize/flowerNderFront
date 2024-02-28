// ========================== 헤더 장바구니 담긴갯수 표시하기 ==========================
document.addEventListener('DOMContentLoaded', function() {
    // 로컬 스토리지에 'cart' 키가 있는지 확인
    if(localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        const cartNumElement = document.querySelector('.cart-num');
        
        // 총 수량 계산
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
        // 장바구니 숫자 업데이트
        cartNumElement.textContent = totalQuantity;
  
        // 장바구니 숫자 표시
        cartNumElement.style.display = 'inline';
        
    } else {
        // 장바구니가 비어있으면 숫자를 숨김
        const cartNumElement = document.querySelector('.cart-num');
        cartNumElement.style.display = 'none';
    }

    
  });
  




// ========================== 헤더 로그인, 로그아웃시 text 변경 ==========================
// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 로컬 스토리지에서 jwt 값을 가져옴
    const jwtToken = localStorage.getItem("jwt");

    // 헤더 업데이트 함수
    function updateHeader() {
        const loginLink = document.querySelector('.h-right a[href="/user/login.html"]');
        

        if (jwtToken) {
            // 로그인 상태인 경우
            loginLink.textContent = 'LOGOUT';
            loginLink.href = '/index.html';  // 일단 로그아웃하면 홈으로 가게 함
        } else {
            // 로그아웃 상태인 경우
            loginLink.textContent = 'LOGIN';
            loginLink.href = '/user/login.html';  // 로그인 페이지로 이동하도록 설정
        }
    }

    // 페이지 로드 시 헤더 업데이트
    updateHeader();

    // 로그아웃 클릭 시 이벤트 처리
    const logoutLink = document.querySelector('.h-right a[href="/index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function() {
            // 로그아웃 누르면 jwt 값 삭제하기
            localStorage.removeItem("jwt");
            // 페이지 새로고침 하기
            location.reload();
        });
    }
});
