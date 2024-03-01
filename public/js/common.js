// ========================== 헤더 장바구니 담긴갯수 표시하기 ==========================
document.addEventListener('DOMContentLoaded', function () {
  // 로컬 스토리지에 'cart' 키가 있는지 확인
  if (localStorage.getItem('cart')) {
    const cartItems = JSON.parse(localStorage.getItem('cart'))
    const cartNumElement = document.querySelector('.cart-num')

    // 총 수량 계산
    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    )

    // 장바구니 숫자 업데이트
    cartNumElement.textContent = totalQuantity

    // 장바구니 숫자 표시
    cartNumElement.style.display = 'inline'
  } else {
    // 장바구니가 비어있으면 숫자를 숨김
    const cartNumElement = document.querySelector('.cart-num')
    cartNumElement.style.display = 'none'
  }
})

// ========================== 헤더 텍스트변경, 비회원,회원,관리자 마이페이지 이동시 ui 설정 ==========================
// ========================== 관리자 -> 로그아웃 -> 인덱스로감 -> 또 다시 로그아웃 눌러야하는 이슈 해결해야함!!!!!!!!
document.addEventListener('DOMContentLoaded', function () {
  // 로컬 스토리지에서 jwt 값을 가져옴
  const jwtToken = localStorage.getItem('jwt')

  // 헤더 업데이트 함수
  function updateHeader() {
    const loginLink = document.querySelector(
      '.h-right a[href="/user/login.html"]'
    )
    const myPageLink = document.querySelector(
      '.h-right a[href="/orders/orderlist.html"]'
    )

    if (jwtToken) {
      // 로그인 상태인 경우
      loginLink.textContent = 'LOGOUT'
      loginLink.href = '/index.html' // 일단 로그아웃하면 홈으로 가게 함

      // API 불러오기
      fetch(`http://localhost:8080/api/v1/mypage`, {
        method: 'GET',
        headers: {
          Authorization: jwtToken,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Fetched Data:', data)

          if (data && data.redirectUrl === '/admin') {
            // "/admin"이면 admin.html로 페이지 이동
            myPageLink.href = '/admin/admin.html'
            loginLink.addEventListener('click', function () {
              // 어드민 마이페이지에서 로그아웃을 누르면 jwt 값 삭제
              localStorage.removeItem('jwt')
              // 페이지 새로고침
              location.href = '/index.html' // 메인 페이지로 이동
            })
          } else {
            // 어드민이 아닌 경우
            loginLink.addEventListener('click', function () {
              // 일반 마이페이지에서 로그아웃을 누르면 jwt 값 삭제
              localStorage.removeItem('jwt')
              // 페이지 새로고침
              location.href = '/index.html' // 메인 페이지로 이동
            })
          }
        })
        .catch(error => {
          console.error('데이터 가져오기 오류:', error)
        })
    } else {
      // 로그아웃 상태인 경우
      loginLink.textContent = 'LOGIN'
      loginLink.href = '/user/login.html' // 로그인 페이지로 이동하도록 설정
      myPageLink.textContent = 'ORDER'
    }
  }

  // 페이지 로드 시 헤더 업데이트
  updateHeader()
})

// 관리자 추가 전
// // ========================== 헤더 로그인, 로그아웃시 text 변경 ==========================
// // 페이지 로드 시 실행
// document.addEventListener('DOMContentLoaded', function () {
//     // 로컬 스토리지에서 jwt 값을 가져옴
//     const jwtToken = localStorage.getItem("jwt");

//     // 헤더 업데이트 함수
//     function updateHeader() {
//         const loginLink = document.querySelector('.h-right a[href="/user/login.html"]');
//         const myPageLink = document.querySelector('.h-right a[href="/orders/orderlist.html"]');

//         if (jwtToken) {
//             // 로그인 상태인 경우
//             loginLink.textContent = 'LOGOUT';
//             loginLink.href = '/index.html';  // 일단 로그아웃하면 홈으로 가게 함
//         } else {
//             // 로그아웃 상태인 경우
//             loginLink.textContent = 'LOGIN';
//             loginLink.href = '/user/login.html';  // 로그인 페이지로 이동하도록 설정

//             myPageLink.textContent = 'ORDER';
//         }
//     }

//     // 페이지 로드 시 헤더 업데이트
//     updateHeader();

//     // 로그아웃 클릭 시 이벤트 처리
//     const logoutLink = document.querySelector('.h-right a[href="/index.html"]');
//     if (logoutLink) {
//         logoutLink.addEventListener('click', function() {
//             // 로그아웃 누르면 jwt 값 삭제하기
//             localStorage.removeItem("jwt");
//             // 페이지 새로고침 하기
//             location.reload();
//         });
//     }
// });
