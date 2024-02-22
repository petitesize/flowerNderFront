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

/* 결제하기 버튼 */
const paymentBtn = document.querySelector(".payment-button");
function isPurchase() {
  // 확인 메시지를 표시하고 사용자의 선택을 확인
  const confirmPurchase = confirm("구매하시겠습니까?");
  if (confirmPurchase) {
    alert("주문이 완료되었습니다.");
  }
}
/* form으로 submit 해야할 것 같지만 일단 click.. */
paymentBtn.addEventListener("click", isPurchase);
