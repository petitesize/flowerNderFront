const wrapBox = document.querySelector('.cart-body-left');
const cartContent = document.querySelector('.cart-content');
const cartContentNone = document.querySelector('.cart-content-none');


// 저장된 카트 가져오기
const saveCart = JSON.parse(localStorage.getItem('cart'));
console.log(saveCart);

// ================ 장바구니에 아무것도 없을때 style 적용 ================
if (saveCart === null || saveCart.length === 0) {
    cartContent.classList.add('none');
} else {
    cartContent.classList.remove('none');
    cartContentNone.classList.add('none');
}

// ---------- 상품 리스트 템플릿
const plusList = () => {
    for(let i = 0; saveCart.length > 0; i++){
        const template  = `
        <div class="cart-list">
            <span class="cl-list-1">
                <input type="checkbox" id="cart-ck1">
                <label for="cart-ck1"><em></em></label>
            </span>
            <span class="cl-list-2">
                <span class="cl-img">
                    <a href="./detail.html">
                        <img src="${saveCart[i].mainImage}" alt="장바구니에 담은 상품 이미지">
                    </a>
                </span> 
                <span class="cl-info">
                    <span class="cl-title">
                        <a href="./detail.html">
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
wrapBox.innerHTML += template;

    }
}

plusList();

