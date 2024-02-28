const wrapBox = document.querySelector('.cart-body-left');
const cartContent = document.querySelector('.cart-content');
const cartContentNone = document.querySelector('.cart-content-none');
const deleteBtn = document.querySelector('.delete-btn');
const deleteAllBtn = document.querySelector('.delete-all-btn');
const ckAll = document.querySelector('.cart-all-ck');
const inputAll = document.querySelector('#cart-all-ck');
const inputName = document.getElementsByName('cart-input');

// 저장된 카트 가져오기
let saveCart = JSON.parse(localStorage.getItem('cart')) || [];

// 장바구니에 아무것도 없을때 style 적용
if (saveCart.length === 0) {
    cartContent.classList.add('none');
} else {
    cartContent.classList.remove('none');
    cartContentNone.classList.add('none');
}

// 상품 리스트 템플릿
const plusList = () => {
    for (let i = 0; i < saveCart.length; i++) {
        const cartTemplate = `
            <div class="cart-list">
                <span class="cl-list-1">
                    <input type="checkbox" name="cart-input" id="cart-ck${i}">
                    <label for="cart-ck${i}"><em></em></label>
                </span>
                <span class="cl-list-2">
                    <span class="cl-img">
                        <a href="detail.html?=${saveCart[i].id}">
                            <img src="${saveCart[i].mainImage}" alt="장바구니에 담은 상품 이미지">
                        </a>
                    </span>
                    <span class="cl-info">
                        <span class="cl-title">
                            <a href="detail.html?=${saveCart[i].id}">
                                ${saveCart[i].title}
                            </a>
                        </span>
                        <span class="cl-dep">
                            <span>필수</span> 제품을 개봉하거나 상품가치가 훼손된 경우에는 제품의 교환 및 환불 불가 안내에 동의합니다.
                        </span>
                    </span>
                    <button class="cart-del-btn"><img src="/public/img/delete.png" alt="삭제버튼"></button>
                </span>
                <span class="cl-list-3">
                    <span class="cart-count">
                        <button class="cc-btn1">-</button>
                        <span class="cart-quantity" data-index="${i}">${saveCart[i].quantity}</span>                        
                        <button class="cc-btn2">+</button>
                    </span>
                    <span class="cart-count-submit">
                        <button class="cart-common-btn">수량변경</button>
                    </span>
                </span>
                <span class="cl-list-4">
                    <span class="cart-price">${saveCart[i].price.toLocaleString()}원</span>
                    <span class="cart-baro">
                        <a href="#" class="cart-common-btn">바로구매</a>
                    </span>
                </span>
            </div>
        `;
        wrapBox.insertAdjacentHTML('beforeend', cartTemplate);
        
    }

    // ========================= 수량 증가 감소 이벤트!!!!!! =========================

        // 수량 증가 이벤트 리스너 등록
        document.querySelectorAll('.cc-btn2').forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.parentElement.parentElement.querySelector('.cart-quantity').getAttribute('data-index'), 10);
                saveCart[index].quantity++;
                refreshCartDisplay();
                updateLocalStorage();
            });
        });

        // 수량 감소 이벤트 리스너 등록
        document.querySelectorAll('.cc-btn1').forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.parentElement.parentElement.querySelector('.cart-quantity').getAttribute('data-index'), 10);
                if (saveCart[index].quantity > 1) {
                    saveCart[index].quantity--;
                    refreshCartDisplay();
                    updateLocalStorage();
                }
            });
        });

    // 수량 변경 버튼 이벤트 리스너 등록
    document.querySelectorAll('.cart-common-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'), 10);
            const newQuantity = parseInt(btn.parentElement.parentElement.querySelector('.cart-quantity').textContent, 10);
            saveCart[index].quantity = newQuantity;
            refreshCartDisplay();
            updateLocalStorage();
        });
    });

}

plusList();


// ========================= 상품을 추가했을때 id 비교후 수량에 추가 =========================
function addItemToCart(newItem) {
    const existingItemIndex = saveCart.findIndex(item => item.id === newItem.id);

    if (existingItemIndex !== -1) {
        // 이미 담긴 상품이라면 수량을 증가시킴
        saveCart[existingItemIndex].quantity++;
    } else {
        // 새로운 상품이라면 카트에 추가
        newItem.quantity = 1;
        saveCart.push(newItem);
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('cart', JSON.stringify(saveCart));

    // 장바구니 화면 갱신
    refreshCartDisplay();
}





// ========================= 삭제하기!!!!!!!!! =========================
inputAll.addEventListener('change', () => {
    const isCheckedAll = inputAll.checked;

    for (let i = 0; i < inputName.length; i++) {
        inputName[i].checked = isCheckedAll;
    }
});


// ----------------- 선택된 상품 삭제
const selectedItemsDeleteBtn = document.querySelector('.cart-ck-delete button:first-child');

selectedItemsDeleteBtn.addEventListener('click', () => {
    // 선택한 상품들의 체크박스 요소를 가져옵니다.
    const selectedItems = document.querySelectorAll('input[name="cart-input"]:checked');

    // 추적할 인덱스 배열을 초기화합니다.
    const selectedIndexes = [];

    selectedItems.forEach(item => {
        // 선택한 체크박스 요소의 부모인 cart-list 클래스를 가진 요소를 찾습니다.
        const listItem = item.closest('.cart-list');

        // 체크박스의 id에서 인덱스를 추출합니다.
        const index = parseInt(item.id.replace('cart-ck', ''), 10);

        // 추적할 인덱스 배열에 추가합니다.
        selectedIndexes.push(index);

        // 화면에서 해당 상품 요소를 삭제합니다.
        listItem.remove();
    });

    // 추적한 인덱스 배열을 역순으로 정렬합니다.
    selectedIndexes.sort((a, b) => b - a);

    // 선택한 인덱스에 해당하는 상품을 saveCart 배열에서 삭제합니다.
    selectedIndexes.forEach(index => {
        saveCart.splice(index, 1);
    });

    // 로컬 스토리지를 업데이트합니다.
    localStorage.setItem('cart', JSON.stringify(saveCart));

    // 장바구니 표시를 갱신합니다.
    refreshCartDisplay();

    // 페이지를 새로고침합니다.
    location.reload(true);
});


// 모든 상품 삭제
const allItemsDeleteBtn = document.querySelector('.cart-ck-delete button:last-child');
allItemsDeleteBtn.addEventListener('click', () => {
    wrapBox.innerHTML = '';
    saveCart = []; // 카트 비우기

    // 로컬 스토리지 업데이트
    localStorage.removeItem('cart');

    // 장바구니 화면 갱신
    refreshCartDisplay();
});

// ========================= 상품 가격 계산 함수 =========================
function calculateProductsPrice() {
    // reduce 함수를 사용하여 모든 상품의 총 가격 계산
    return saveCart.reduce((acc, item) => acc + item.quantity * item.price, 0);
}


// ========================= 장바구니 화면 업데이트!!! 새로고침 함수 =========================
    function refreshCartDisplay() {

        // ---------------- 장바구니 ui!!
        // 장바구니 비어있을때 화면 ui
        if (saveCart.length === 0) {
            cartContent.classList.add('none');
            cartContentNone.classList.remove('none');
        } else {
            // 장바구니에 담았을때 ui
            cartContent.classList.remove('none');
            cartContentNone.classList.add('none');
        }


        // ---------------- 장바구니 총 수량 금액 부분
        // 장바구니에 담긴 상품 수량 합치기!
        const productsQuantity = document.querySelector('.products-quantity');
        productsQuantity.textContent = saveCart.reduce((acc, item) => acc + item.quantity, 0);
        // acc 누적된 상품의 수량 item 각각의 상품 객체

        // 상품의 총 금액
        const productsPrice = document.querySelector('.products-price');
        productsPrice.textContent = calculateProductsPrice().toLocaleString() + '원';
                    
        // 배송비 설정
        const deliveryPrice = document.querySelector('.delivery-price');
        const fixedDeliveryFee = 3500;
        deliveryPrice.textContent = '착불';

        // 총 주문금액!!
        const totalPrice = document.querySelector('.total-price');
        const totalOrderPrice = calculateProductsPrice() + fixedDeliveryFee;
        totalPrice.textContent = totalOrderPrice.toLocaleString() + '원';


        // 상품 수량 갱신
        document.querySelectorAll('.cart-quantity').forEach((quantitySpan, index) => {
            quantitySpan.textContent = saveCart[index].quantity;
        });


    
    }

// ========================= 수량 변경 버튼 이벤트 리스너 등록 =========================
document.querySelectorAll('.cart-common-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10); 
        // 클릭한 버튼이 속한 상품의 인덱스 가져오기
        const newQuantity = parseInt(btn.parentElement.parentElement.querySelector('.cart-quantity').textContent, 10); 
        // 새로 설정할 수량 가져오기
        saveCart[index].quantity = newQuantity; 
        // 장바구니의 해당 상품 수량 업데이트


        // location.reload(true);
        refreshCartDisplay(); // 장바구니 화면 갱신
    });
});

// 초기 로드 시 장바구니 업데이트
refreshCartDisplay();

// 로컬 스토리지 업데이트 함수 정의
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(saveCart));
}



    function calculateProductsPrice() {
        return saveCart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    }

    
// 초기 로드 시 장바구니 업데이트
refreshCartDisplay();

