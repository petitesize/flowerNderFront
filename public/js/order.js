import { API_URL } from "/public/js/constants.js";

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
const directInput = document.querySelector(".direct-input");
function handleSelectChange(select) {
  const selectOption = select.target.value;
  if (selectOption === "직접 입력") {
    directInput.style.display = "inline-block";
  } else {
    directInput.style.display = "none";
  }
}

selectDeliveryMsg.addEventListener("change", handleSelectChange);

/* 배송 메시지 가져오기 */
function getDeliveryMsg() {
  // selectedIndex 사용, handleSelectChange도 바꿔주면 좋을 듯
  const selectOption =
    selectDeliveryMsg.options[selectDeliveryMsg.selectedIndex].value;
  console.log(selectDeliveryMsg.options);
  if (selectOption === "직접 입력") {
    return directInput.value;
  }
  return selectOption;
}

/* 로컬스토리지에서 저장된 상품 가져오기 */
const LOCALSTORAGE_CART = "cart";
const $orderContainer = document.querySelector(".order-item-conatiner");
const cartsJSON = window.localStorage.getItem(LOCALSTORAGE_CART);
const carts = JSON.parse(cartsJSON);
let orderAmount = 0;
let htmlContent = "";
carts.forEach((item) => {
  const { title, quantity, price, mainImage } = item;
  const itemAmount = parseInt(price) * parseInt(quantity);
  orderAmount += itemAmount;
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
                    <span class="item-amount">${itemAmount.toLocaleString()}원</span>
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
    /* 주문자 정보 */
    const $ordererName = document.querySelector(".orderer-name");
    const $ordererPhone = document.querySelector(".orderer-phone");
    const $ordererEmail = document.querySelector(".orderer-email");
    /* 수령인 정보 */
    const $recipientName = document.querySelector(".recipient-name-input");
    const $recipientPhone = document.querySelector(".recipient-phone-input");
    const $postcode = document.querySelector(".postcode-input");
    const $address = document.querySelector(".address-input");
    const $addressDetail = document.querySelector(".address-detail-input");

    alert("주문이 완료되었습니다.");
    // 로컬스토리지에 auth가 추가될 수도 있으니 일단 removeItem 사용해보기
    localStorage.clear();
    localStorage.removeItem(LOCALSTORAGE_CART);
    // 일단 메인화면으로 이동하는데, 할 수 있다면 주문조회 화면으로 가면 좋을 듯
    window.location.href = "/";
    fetch(`${API_URL}order/`, {
      method: "POST",
      // 헤더에 JSON 포맷 사용할 것이라고 알려줌
      headers: {
        "Content-Type": "application/json",
      },
      // JSON 포맷으로 객체 변환해서 전달해줌
      body: JSON.stringify({
        order_amount: orderAmount,
        order_status: "입금확인중",
        // 가능하다면, 무통장입금 요소 불러서 넣어주기, 일단은 결제 수단이 한 가지기 때문에 하드코딩
        pay_method: "무통장입금",
        order_items: carts.map((item) => {
          const { id, title, quantity, price, mainImage } = item;
          return { product_id: id, title, quantity, total_amount: price };
        }),
        customer_info: {
          name: $ordererName.value,
          email: $ordererEmail.value,
          // 전화번호 양식 통일 시키면 좋을 듯 : 하이픈 포함하여 적어도 db에는 01012345678로 가게
          // validation은 하이픈 제거 후 length로?
          phone_number: $ordererPhone.value,
        },
        shipping_info: {
          recipient: $recipientName.value,
          // 전화번호 양식 통일 시키면 좋을 듯
          phone_number: $recipientPhone.value,
          postal_code: $postcode.value,
          address: $address.value,
          address_detail: $addressDetail.value,
          // 나중에 Memo로 통일하기..
          delivery_memo: getDeliveryMsg(),
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}
/* form으로 submit 해야할 것 같지만 일단 click 
  : 우리는 템플릿 엔진 사용하지 않고, form으로 submit 하지 않고 fetch 활용 하는 걸로 */
paymentBtn.addEventListener("click", isPurchase);
