import { API_URL } from "/public/js/constants.js";

/* guest_orderlist.js 이사 */
const $searchBtn = document.querySelector(".gol-btn");
// 조회하기 버튼 클릭 시
$searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // display 작업
  const $orderlist = document.querySelector(".orderlist");
  const $searchForm = document.querySelector(".inside");
  $orderlist.style.display = "block";
  $searchForm.style.display = "none";

  // 입력 값 가져오기
  // 이름은 띄어쓰기 생각해서 URL 인코딩해줌
  const orderId = document.querySelector(".search-order-id").value;
  const nameValue = document.querySelector(".search-name").value;
  const name = encodeURIComponent(nameValue);
  const email = document.querySelector(".search-email").value;
  /* 데이터 test용이므로 실 테스트 시 위에 코드 주석 해제하여 확인*/
  // const orderId = "65d8143380db9d9a208455d6";
  // const nameValue = "John Doe";
  // const name = encodeURIComponent(nameValue);
  // const email = "john.doe@example.com";

  fetch(`${API_URL}order/${orderId}?name=${name}&email=${email}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      const data = res.data;
      console.log(data);
      const {
        order_items: orderItems,
        order_date: orderDate,
        _id: orderId,
        order_status: orderStatus,
      } = data;
      showSearchResult(orderItems, orderDate, orderId, orderStatus);
    });
});

// 조회 요청한 데이터 렌더링 함수
function showSearchResult(orderItems, orderDate, orderId, orderStatus) {
  const formattedDate = orderDate.split("T")[0];
  const $orderlistBody = document.querySelector(".orderlist-tbody");
  let htmlContent = "";
  orderItems.forEach((item) => {
    console.log(item);
    const { title, quantity, total_amount: totalAmount } = item;
    htmlContent += `
      <tr>
      <td>
        <div class="product-row">
          <a href="#" class="img-block">
            <img src="" alt="상품사진" />
          </a>
          <ul class="product-info">
            <li class="name">
              <a href="#">${title}</a>
            </li>
          </ul>
        </div>
      </td>
      <td>${formattedDate}</td>
      <td>${orderId}</td>
      <td>
        ${totalAmount}원
        <br />
        <span class="quantity-span">${quantity}개</span>
      </td>
      <td>
        <div class="delivery-status">
          <span class="delivery-step">${orderStatus}</span>
          <button class="change-address button-black">
            배송지 변경
          </button>
          <button class="delivery-cancel button-black">주문취소</button>
        </div>
      </td>
    </tr>
      `;
  });
  $orderlistBody.innerHTML = htmlContent;
}

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
// document.addEventListener("DOMContentLoaded", handleNoOrderMessage);

/* <input class="input-order-id" type="text" placeholder="주문번호" />
            <input
              class="input-border input-name"
              type="text"
              placeholder="이름"
            />
            <input class="input-email" type="email" placeholder="이메일" />
          </div>
          <button class="gol-btn button-black-big">조회하기</button> */
