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
  