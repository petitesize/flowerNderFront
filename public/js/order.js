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
