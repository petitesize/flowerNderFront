import { API_URL } from "/public/js/constants.js";
const LOCALSTORAGE_JWT = "jwt";

document.addEventListener("DOMContentLoaded", () => {
  const $orderlist = document.querySelector(".orderlist");
  const $searchForm = document.querySelector(".inside");
  const $nav = document.querySelector("nav");
  $nav.style.display = "none";
  const jwtJSON = window.localStorage.getItem(LOCALSTORAGE_JWT);
  if (jwtJSON) {
    $searchForm.style.display = "none";
    $orderlist.style.display = "block";
    $nav.style.display = "block";
    // const jwt = JSON.parse(jwtJSON);

    fetch(`${API_URL}user/order`, {
      method: "GET",
      headers: {
        authorization: jwtJSON,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error, Status: ${res.status}`);
        }

        return res.json();
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        if (data === null) {
          handleNoOrderMessage();
          return;
        }

        // 회원은 data가 무조건 배열로 온다
        // const { shipping_info: shippingInfo, cancel_req: cancelReq } = data[0];
        data.forEach((order, index) => {
          const {
            order_items: orderItems,
            order_date: orderDate,
            _id: orderId,
            order_status: orderStatus,
            cancel_req: cancelReq,
            shipping_info: shippingInfo,
          } = order;
          // console.log(order);
          showSearchResult(orderItems, orderDate, orderId, orderStatus);
          changeStatus(cancelReq, index);
          setShippingInfo(shippingInfo);
        });
        handleNoOrderMessage();
        handleChangeAddressButton();
        /* 배송지 변경창을 조회자 정보로 setting
          이후 템플릿리터럴을 조회 정보로 변경
          조회된 주문이 취소된 주문인지 확인 */
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

const $orderId = document.querySelector(".search-order-id");

/* 취소요청(cancelReq) 확인하여 true면, 배송상태를 주문취소요청으로 변경
  이후 배송정보변경 및 주문취소 버튼 비활성화 */
function changeStatus(cancelReq, index) {
  if (index === undefined) {
    const $deliveryStep = document.querySelector(".delivery-step");
    if (cancelReq) {
      $deliveryStep.textContent = "주문취소요청";
      handleBtnByCancel(cancelReq);
    }
    return;
  }
  const $deliveryStep = document.querySelectorAll(".delivery-step")[index];
  if (cancelReq) {
    $deliveryStep.textContent = "주문취소요청";
    handleBtnByCancel(cancelReq, index);
  }
}

/* cancelReq이 true면 버튼 disable */
function handleBtnByCancel(cancelReq, index) {
  if (index === undefined) {
    const changeAddressButton = document.querySelector(".change-address");
    const deliveryCancelButton = document.querySelector(".delivery-cancel");
    if (cancelReq) {
      changeAddressButton.classList.add("disabled-btn");
      deliveryCancelButton.classList.add("disabled-btn");
    } else {
      changeAddressButton.classList.remove("disabled-btn");
      deliveryCancelButton.classList.remove("disabled-btn");
    }
    return;
  }

  const changeAddressButton =
    document.querySelectorAll(".change-address")[index];
  const deliveryCancelButton =
    document.querySelectorAll(".delivery-cancel")[index];

  if (cancelReq) {
    changeAddressButton.classList.add("disabled-btn");
    deliveryCancelButton.classList.add("disabled-btn");
  } else {
    changeAddressButton.classList.remove("disabled-btn");
    deliveryCancelButton.classList.remove("disabled-btn");
  }
}

/***** 비회원 전용 : 주문 조회 *****/
const $searchBtn = document.querySelector(".gol-btn");
$searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // display 작업 : 조회검색 창 사라지고, 주문조회 창 보여줌
  const $orderlist = document.querySelector(".orderlist");
  const $searchForm = document.querySelector(".inside");

  // 입력 값 : 띄어쓰기 생각해서 URL 인코딩해줘야함, 공백제거(trim())
  // 이 orderId는
  const orderId = $orderId.value.trim();
  const nameValue = document.querySelector(".search-name").value.trim();
  const name = encodeURIComponent(nameValue);
  const emailValue = document.querySelector(".search-email").value.trim();
  const email = encodeURIComponent(emailValue);

  fetch(`${API_URL}order/${orderId}?name=${name}&email=${email}`, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP Error, Status: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      $orderlist.style.display = "block";
      $searchForm.style.display = "none";
      console.log("res입니다" + res);
      const data = res.data;
      console.log("데이터입니다" + data);

      // 비회원은 orderId로 조회하기 때문에 data가 무조건 객체로 옴
      const {
        order_items: orderItems,
        order_date: orderDate,
        _id: orderId,
        order_status: orderStatus,
        shipping_info: shippingInfo,
        cancel_req: cancelReq,
      } = data;
      /* 배송지 변경창을 조회자 정보로 setting
        이후 템플릿리터럴을 조회 정보로 변경
        조회된 주문이 취소된 주문인지 확인 */
      setShippingInfo(shippingInfo);
      showSearchResult(orderItems, orderDate, orderId, orderStatus);
      changeStatus(cancelReq);
      handleChangeAddressButton();
    })
    .catch((err) => {
      // 일치하는 주문이 없으면 바로 이곳으로 넘어올 것
      alert("일치하는 주문이 없습니다.");
    });
});

/* orderStatus 입금 확인 중에만 배송지 변경/주문 취소 가능하도록 */
function disableBtnByStatus(orderStatus) {
  if (!(orderStatus === "입금확인중")) {
    return "disabled-btn";
  }
  return;
}

/* 조회 요청한 데이터 렌더링 함수 */
function showSearchResult(orderItems, orderDate, orderId, orderStatus) {
  const formattedDate = orderDate.split("T")[0];
  const $orderlistBody = document.querySelector(".orderlist-tbody");
  let htmlContent = "";
  let paymentAmount = 0;
  const rowspan = orderItems.length;

  orderItems.forEach((item) => {
    paymentAmount += parseInt(item.total_amount) * parseInt(item.quantity);
  });

  orderItems.forEach((item, index) => {
    const { title, quantity, total_amount: totalAmount } = item;

    // 첫 번째 td만 rowspan, border를 적용하기 위한 변수
    const rowspanAttribute = index === 0 ? `rowspan="${rowspan}"` : "";
    const borderTableRow = index === 0 ? `class="row-border"` : "";
    htmlContent += `
    <tr ${borderTableRow}>
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
      <td>
        ${totalAmount.toLocaleString()}원
        <br />
        <span class="quantity-span">${quantity}개</span>
      </td>
      <td>${formattedDate}</td>
      <td>${orderId}</td>
      ${
        index === 0
          ? `<td ${rowspanAttribute}>${paymentAmount.toLocaleString()}원</td>`
          : ""
      }
      <!-- rowspan 적용된 곳은 빈 칸으로 비워둬야함 -->
      ${
        index === 0
          ? `<td class="span-td" ${rowspanAttribute}>
      <div class="delivery-status">
        <span class="delivery-step">${orderStatus}</span>
        <button class="${disableBtnByStatus(
          orderStatus
        )} change-address button-black">
          배송지 변경
        </button>
        <button class="${disableBtnByStatus(
          orderStatus
        )} delivery-cancel button-black">주문취소</button>
      </div>
    </td>`
          : ""
      }
      
    </tr>
  `;
  });

  const jwtJSON = window.localStorage.getItem(LOCALSTORAGE_JWT);
  // 회원은 조회할 데이터가 2개 이상일 수 있지만, 비회원은 하나의 orderId밖에 조회하지 못한다.
  // 이게 꼭 필요한지는 모르겠음 지울 수 있을까?
  if (jwtJSON) {
    $orderlistBody.innerHTML += htmlContent;
  } else {
    $orderlistBody.innerHTML = htmlContent;
  }

  // handleChangeAddressButton();
}

/* 배송지 변경 */
const overlay = document.querySelector(".overlay-modal");
const modal = document.querySelector(".change-address-modal");
const tableBody = document.querySelector(".orderlist-tbody");

/* 배송 정보 저장 */
function setShippingInfo(shippingInfo) {
  const $modalSection = document.querySelector(".modal-section");
  const {
    address,
    address_detail: addressDetail,
    phone_number: phoneNumber,
    postal_code: postalCode,
    recipient,
  } = shippingInfo;
  console.log(address, addressDetail, postalCode, recipient);
  $modalSection.innerHTML = `
            <div class="name-block input-block">
              <label for="name">이름 </label>
              <div class="input-name">
                <input
                  type="text"
                  name="name"
                  required="required"
                  value="${recipient}"
                />
              </div>
            </div>
            <div class="phone-block input-block">
              <label for="phone">연락처</label>
              <div class="input-phone">
                <input
                  type="tel"
                  name="phone"
                  required="required"
                  value="${phoneNumber}"
                />
              </div>
            </div>
            <div class="address-block input-block">
              <label for="address">주소</label>
              <div class="address-wrap">
                <div class="input-postcode">
                  <input
                    type="text"
                    name="address"
                    required="required"
                    value="${postalCode}"
                  />
                </div>
                <div class="input-address">
                  <input
                    class="input-border"
                    type="text"
                    name="address"
                    required="required"
                    value="${address}"
                  />
                  <!-- <button class="search-address button-black">주소 검색</button> -->
                </div>
                <div class="input-address-detail">
                  <input
                    type="text"
                    name="address-detail"
                    required="required"
                    value="${addressDetail}"
                  />
                </div>
              </div>
            </div>
  `;
}

/* 모달 열기 */
function openChangeAddressModal(event) {
  const closestTr = event.target.closest("tr");
  const orderIdTd = closestTr.querySelector("td:nth-child(4)");
  const orderId = orderIdTd.textContent;
  console.log(orderId + "왜두번");
  overlay.style.display = "block";
  modal.style.display = "block";
  // 모달 확인 버튼 El 불러와서, 배송지 입력 후 input value를 불러온 후 PATCH를 날려준다
  const confirmButton = document.querySelector(".confirm-button");
  // 이벤트핸들러가 중복 등록되어서 틀어막기식으로 조치해줬는데.. 해결방법 생각해봐야함
  // 컨펌안하고 다시 취소눌렀을 때 추가 처리 문의
  const confirmButtonClickHandler = function () {
    changeShippingAddress(orderId);
    closeChangeAddressModal();
    confirmButton.removeEventListener("click", confirmButtonClickHandler);
  };
  confirmButton.addEventListener("click", confirmButtonClickHandler);
}

// 모달 닫기
function closeChangeAddressModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

/* 현재 화면에서의 배송지 변경 버튼 이벤트 등록
  주문이 여러개면, 버튼도 여러개이므로 change-address 이렇게 했는데.. 더 좋은 방법이 있을 듯 */
function handleChangeAddressButton() {
  const $orderlist = document.querySelector(".orderlist");

  if ($orderlist) {
    $orderlist.addEventListener("click", function (event) {
      if (event.target.classList.contains("change-address")) {
        const thisEvent = event;
        openChangeAddressModal(thisEvent);
      }
    });
  }
}

/* 배송지 변경 PATCH API 함수 
  모달 열 때, 배송지 변경 버튼이 클릭된 주문의 id 전달해줌*/
// 이름 update로 통일하면 좋을 듯

function changeShippingAddress(orderId) {
  const $nameInput = document.querySelector(".input-name input");
  const $phoneInput = document.querySelector(".input-phone input");
  const $postcodeInput = document.querySelector(".input-postcode input");
  const $addressInput = document.querySelector(".input-address input");
  const $addressDetailInput = document.querySelector(
    ".input-address-detail input"
  );

  /* ***  어떤 방법이 가장 좋을까?  *** 
    1. 주문번호 엘리먼트 value 뽑아오기 
    2. GET 해온거에서 가져오기?
    3. 어차피 같은 화면이고, 주문 번호 입력 할 때 id를 입력하니까 value 그대로 들고 여기서 쓸까? 
     => 일단 3번으로 */
  fetch(`${API_URL}order/shipping/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      shipping_info: {
        recipient: $nameInput.value,
        phone_number: $phoneInput.value,
        postal_code: $postcodeInput.value,
        address: $addressInput.value,
        address_detail: $addressDetailInput.value,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP Error, Status: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

const closeButton = document.querySelector(".close");
const cancelButtonInModal = document.querySelector(".cancel-button");
closeButton.addEventListener("click", closeChangeAddressModal);
cancelButtonInModal.addEventListener("click", closeChangeAddressModal);
// 모달 외부 클릭 시 닫기
// overlay.addEventListener("click", function (event) {
//   if (event.target === overlay) {
//     closeChangeAddressModal();
//   }
// });

/* 주문 취소 */
function cancelOrder(id) {
  const confirmCancel = confirm("주문을 취소하시겠습니까?");
  if (confirmCancel) {
    // const orderId = $orderId.value;
    const orderId = id;
    console.log(orderId + "~~~");
    // order_status : "입금확인중" 일 때 만
    /* !!!!!!!!!!PATCH 어떻게 할 지 먼저 결정 되어야 함!!!!!!!!!!!! */
    // fetch PATCH 사용하여 status를 cancle 시켜주자
    fetch(`${API_URL}order/cancel/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_req: true,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data.cancel_req);
        // res 데이터의 cancel_req 확인하여, true이면 배송상태를 취소요청 으로 바꿔줌
        changeStatus(res.data.cancel_req);
      })
      .catch((err) => console.log(err));
    // 해당 주문 row를 삭제해버리는 기능 : 관리자가 할 것임
    // const row = button.closest("tr");
    // if (row) {
    //   row.remove();
    // }
  }
}

// 주문 취소 이벤트리스너 : 변경시켜야할까?
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delivery-cancel")) {
    const closestTr = event.target.closest("tr");
    // 4는 orderId가 있는 <td>의 순서에 따라 달라질 수 있음
    const orderIdTd = closestTr.querySelector("td:nth-child(4)");
    const orderId = orderIdTd.textContent;
    cancelOrder(orderId);
  }
  handleNoOrderMessage();
});

// 주문 내역이 없을 경우 : 비회원일 경우 쓸 일이 없을 듯
function handleNoOrderMessage() {
  const tableRows = document.querySelectorAll(".orderlist-tbody tr");
  if (tableRows.length < 1) {
    tableBody.innerHTML = `<tr class="no-order">
        <td colspan="6">주문 내역이 없습니다.</td>
      </tr>`;
  }
}

// 주문 조회 첫 진입 시 주문 내역이 있는지 확인 : 비회원 사용할 일 없음
