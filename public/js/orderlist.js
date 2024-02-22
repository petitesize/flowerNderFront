/* 배송지 변경 */
const overlay = document.querySelector(".overlay-modal");
const modal = document.querySelector(".change-address-modal");
const tableBody = document.querySelector(".orderlist-tbody");
const changeAddressButton = document.querySelector(".change-address");

// 모달 열기
function openChangeAddressModal() {
  overlay.style.display = "block";
  modal.style.display = "block";
}

if (changeAddressButton) {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("change-address")) {
      openChangeAddressModal();
    }
  });
}

// 모달 닫기
function closeChangeAddressModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

const closeButton = document.querySelector(".close");
const confirmButton = document.querySelector(".confirm-button");
closeButton.addEventListener("click", closeChangeAddressModal);
confirmButton.addEventListener("click", closeChangeAddressModal);

// 모달 외부 클릭 시 닫기
overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closeChangeAddressModal();
  }
});

/* 주문 취소 */
function cancelOrder(button) {
  // confirm
  const confirmCancel = confirm("주문을 취소하시겠습니까?");
  if (confirmCancel) {
    const row = button.closest("tr");
    if (row) {
      row.remove();
    }
  }
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delivery-cancel")) {
    cancelOrder(event.target);
  }
  handleNoOrderMessage();
});

// 주문 내역이 없을 경우
function handleNoOrderMessage() {
  const tableRows = document.querySelectorAll(".orderlist-tbody tr");
  if (tableRows.length < 1) {
    tableBody.innerHTML = `<tr class="no-order">
        <td colspan="5">주문 내역이 없습니다.</td>
      </tr>`;
  }
}

// 주문 조회 첫 진입 시 주문 내역이 있는지 확인
document.addEventListener("DOMContentLoaded", handleNoOrderMessage);
