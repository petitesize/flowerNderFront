/* 주문자 정보와 동일 체크박스 */
const checkbox = document.querySelector(".checkbox");
const ordererName = document.querySelector(".orderer-name");
const ordererPhone = document.querySelector(".orderer-phone");
const recipientName = document.querySelector(".recipient-name-input");
const recipientPhone = document.querySelector(".recipient-phone-input");

function handleCheckboxChange() {
  const name = ordererName.value;
  const phone = ordererPhone.value;
  if (checkbox.checked) {
    recipientName.value = name;
    recipientPhone.value = phone;
  } else {
    recipientName.value = "";
    recipientPhone.value = "";
  }
}

checkbox.addEventListener("change", handleCheckboxChange);

/* 배송 메시지 직접 입력 */
const selectDeliveryMsg = document.querySelector(".delivery-msg");

function handleSelectChange(select) {
  const directInput = document.querySelector(".direct-input");
  const selectOption = select.target.value;
  if (selectOption === "직접 입력") {
    directInput.style.display = "inline-block";
  } else {
    directInput.style.display = "none";
  }
}

selectDeliveryMsg.addEventListener("change", handleSelectChange);

/* 로컬스토리지에서 저장된 상품 가져오기 */
const LOCALSTORAGE_CART = "cart";
const $orderContainer = document.querySelector(".order-item-conatiner");
const cartsJSON = window.localStorage.getItem(LOCALSTORAGE_CART);
const carts = JSON.parse(cartsJSON);
let orderAmount = 0;
let htmlContent = "";
carts.forEach((item) => {
  const { title, quantity, price, mainImage } = item;
  console.log(title, quantity, price, mainImage);
  orderAmount += parseInt(price);
  htmlContent += `
 <div class="order-item">
                <a href="#">
                  <div class="img-wrap">
                    <img src="${mainImage}" alt="주문 상품 이미지" />
                  </div>
                  <div class="info-wrap">
                    <span class="item-title large-font"> ${title} </span>
                    <!-- <span class="item-option"> 옵션 </span> -->
                    <span class="item-quantity">${quantity}개</span>
                    <span class="item-amount">${price.toLocaleString()}원</span>
                  </div>
                </a>
              </div> `;
});
$orderContainer.innerHTML = htmlContent;

/* 주문 요약에 주문 총액 보여주기 : 현재 배송비는 모두 착불(0원)이므로 주석 처리 */
const $orderAmount = document.querySelector(".order-amount-p");
// const $deliveryFee = document.querySelector(".delivery-fee-p");
const deliveryFee = 0;
const $payAmount = document.querySelector(".pay-amount-p");
$orderAmount.innerHTML = `${orderAmount.toLocaleString()}원`;
$payAmount.innerHTML = `${(orderAmount + deliveryFee).toLocaleString()}원`;

/* 결제하기 버튼 */
const paymentBtn = document.querySelector(".payment-button");
function isPurchase() {
  // 확인 메시지를 표시하고 사용자의 선택을 확인
  const confirmPurchase = confirm("구매하시겠습니까?");
  if (confirmPurchase) {
    alert("주문이 완료되었습니다.");
    // 로컬스토리지에 새로운 key가 추가될 수도 있으니 removeItem 사용해보기
    // localStorage.clear()
    localStorage.removeItem(LOCALSTORAGE_CART);
    // 일단 메인화면으로 이동하는데, post 구현해보고 할 수 있다면 주문조회 화면으로..
    window.location.href = "/";
  }
}
/* form으로 submit 해야할 것 같지만 일단 click.. */
// 여기에 post api 구현 해야함!
paymentBtn.addEventListener("click", isPurchase);
