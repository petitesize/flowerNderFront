const overlay = document.querySelector(".overlay-modal");
const modal = document.querySelector(".change-address-modal");
const tableBody = document.querySelector(".orderlist-tbody");

// 모달 열기
function openChangeAddressModal() {
  overlay.style.display = "block";
  modal.style.display = "block";
}

// 배송지 변경 버튼
const changeAddressButton = document.querySelector(".change-address");
if (changeAddressButton) {
  changeAddressButton.addEventListener("click", openChangeAddressModal);
}

// 모달 닫기
function closeChangeAddressModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

// 모달 닫기
const closeButton = document.querySelector(".close");
const confirmButton = document.querySelector(".confirm-button");
closeButton.addEventListener("click", closeChangeAddressModal);
confirmButton.addEventListener("click", closeChangeAddressModal);

// 모달 외부 클릭 시 닫기
/* overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closeChangeAddressModal();
  }
});
*/

function cancelOrder(button) {
  // 확인 메시지를 표시하고 사용자의 선택을 확인
  const confirmCancel = confirm("주문을 취소하시겠습니까?");

  if (confirmCancel) {
    // 확인을 눌렀을 때 해당 행(row) 삭제
    const row = button.closest("tr");
    if (row) {
      row.remove();
    }
  }
}

// 주문 취소 버튼
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delivery-cancel")) {
    cancelOrder(event.target);
  }
  handleNoOrderMessage();
});

function handleNoOrderMessage() {
  const tableRows = document.querySelectorAll(".orderlist-tbody tr");
  if (tableRows.length < 1) {
    tableBody.innerHTML = `<tr class="no-order">
        <td colspan="5">주문 내역이 없습니다.</td>
      </tr>`;
  }
}

document.addEventListener("DOMContentLoaded", handleNoOrderMessage);
