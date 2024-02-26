const wrapBox = document.querySelector('.cart-body-left')
const cartContent = document.querySelector('.cart-content')
const cartContentNone = document.querySelector('.cart-content-none')
const deleteBtn = document.querySelector('.delete-btn')
const deleteAllBtn = document.querySelector('.delete-all-btn')
const ckAll = document.querySelector('.cart-all-ck')
//모두체크하기 누르면 ck라고 이름이 명시된 인풋 체크되게
const inputAll = document.querySelector('#cart-all-ck')
const inputName = document.getElementsByName('cart-input')

console.log(inputAll)

// 저장된 카트 가져오기
const saveCart = JSON.parse(localStorage.getItem('cart'))
// console.log(saveCart);

// ================ 장바구니에 아무것도 없을때 style 적용 ================
if (saveCart === null || saveCart.length === 0) {
  cartContent.classList.add('none')
} else {
  cartContent.classList.remove('none')
  cartContentNone.classList.add('none')
}

// ---------- 상품 리스트 템플릿
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
                    <span>1</span>
                    <button class="cc-btn2">+</button>
                </span>
                <span class="cart-count-submit">
                    <button class="cart-common-btn">수량변경</button>
                </span>
            </span>
            <span class="cl-list-4">
                <span class="cart-price">${saveCart[i].price}</span>
                <span class="cart-baro">
                    <a href="#" class="cart-common-btn">바로구매</a>
                </span>
            </span>
        </div>
`
    wrapBox.insertAdjacentHTML('beforeend', cartTemplate)
  }
}

plusList()

inputAll.addEventListener('change', () => {
  const isCheckedAll = inputAll.checked

  for (let i = 0; i < inputName.length; i++) {
    inputName[i].checked = isCheckedAll
  }
})

const selectedItemsDeleteBtn = document.querySelector(
  '.cart-ck-delete button:first-child'
)
const allItemsDeleteBtn = document.querySelector(
  '.cart-ck-delete button:last-child'
)

selectedItemsDeleteBtn.addEventListener('click', () => {
  // 선택된 상품 삭제
  const selectedItems = document.querySelectorAll(
    'input[name="cart-input"]:checked'
  )

  // 삭제 로직을 여기에 작성하세요 (예: UI에서 삭제, localStorage 업데이트 등)
  selectedItems.forEach(item => {
    const listItem = item.closest('.cart-list')
    // 삭제 로직을 여기에 작성하세요 (UI에서 삭제, localStorage 업데이트 등)
    listItem.remove()
  })
})

allItemsDeleteBtn.addEventListener('click', () => {
  // 모든 상품 삭제
  wrapBox.innerHTML = '' // UI에서 전체 카트를 지우기

  // 삭제 로직을 여기에 작성하세요 (예: localStorage 업데이트)
  localStorage.removeItem('cart')

  // 카트 내용이 비어있는지 여부에 따라 cartContent의 표시 여부를 업데이트합니다.
  if (wrapBox.childElementCount === 0) {
    cartContent.classList.add('none')
    cartContentNone.classList.remove('none')
  }
})

// // 삭제 버튼 이벤트 리스너
// deleteBtn.addEventListener('click', () => {
//     const cartCheckboxes = document.querySelectorAll('.cl-list-1 input[type="checkbox"]');

//     // 체크된 상품을 찾아서 배열에 추가
//     const selectedProducts = [];

//     cartCheckboxes.forEach((checkbox, index) => {
//         if (checkbox.checked) {
//             selectedProducts.push(index);
//         }
//     });

//     // 선택된 상품 삭제
//     selectedProducts.forEach(index => {
//         saveCart.splice(index, 1);
//     });

//     // 로컬스토리지에 저장
//     localStorage.setItem('cart', JSON.stringify(saveCart));

//     // 장바구니 화면 갱신
//     refreshCart();
// });

// // 새로고침 함수
// function refreshCart() {
//     // 상품 리스트 갱신 전에 cartContentNone 보이도록 처리
//     cartContentNone.classList.remove('none');
//     cartContent.classList.add('none');

//     wrapBox.innerHTML = '';
//     plusList();

//     // 상품 리스트 갱신 후에 UI 조정
//     const saveCart = JSON.parse(localStorage.getItem('cart'));
//     if (saveCart === null || saveCart.length === 0) {
//         cartContent.classList.add('none');
//         cartContentNone.classList.remove('none');
//     } else {
//         cartContent.classList.remove('none');
//         cartContentNone.classList.add('none');
//     }
// }

// // 초기 로드 시 장바구니 업데이트
// updateCartDisplay();

// // 상품 추가, 삭제 또는 기타 업데이트 이벤트가 발생할 때마다 아래와 같이 호출
// // 예: 상품 추가 버튼 클릭, 상품 삭제 버튼 클릭, 수량 변경 등
// // updateCartDisplay();

// //만약
