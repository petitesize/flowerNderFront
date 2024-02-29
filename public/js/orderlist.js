import { API_URL } from "/public/js/constants.js";
const LOCALSTORAGE_JWT = "jwt";

/***** orderlist.html 진입 시, order API GET해와서 주문조회 데이터 렌더링 *****/
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
        data.forEach((order, index) => {
          const {
            order_items: orderItems,
            order_date: orderDate,
            _id: orderId,
            order_status: orderStatus,
            cancel_req: cancelReq,
            shipping_info: shippingInfo,
          } = order;
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

/***** 조회 요청한 데이터 렌더링 함수 
  비회원, 회원 모두
  이 렌더링이 다 끝난 상황을 바탕으로 다른 후속 요청 처리를 해줘야한다..*****/
function showSearchResult(orderItems, orderDate, orderId, orderStatus) {
  const formattedDate = orderDate.split("T")[0];
  const $orderlistBody = document.querySelector(".orderlist-tbody");
  let htmlContent = "";
  let paymentAmount = 0;
  const rowspan = orderItems.length;

  /* 총 주문 금액만 먼저 구해줌
    이 방법(루프 두 번) 밖에 없는지 고민 */
  orderItems.forEach((item) => {
    paymentAmount += parseInt(item.total_amount) * parseInt(item.quantity);
  });

  orderItems.forEach((item, index) => {
    const { title, quantity, total_amount: totalAmount } = item;

    /* 첫 번째 td만 rowspan, border를 적용하기 위한 변수 */
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
      <td class="order-id-td">${orderId}</td>
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
  /* 데이터 형식 다를 때 작성해둔거라 다시 생각해봐야함.. 일단 Keep */
  if (jwtJSON) {
    $orderlistBody.innerHTML += htmlContent;
  } else {
    $orderlistBody.innerHTML = htmlContent;
  }
}

/* 1. 취소요청(cancelReq) 확인하여 true인 것이 있다면, 배송상태를 주문취소요청으로 변경
  이후 배송정보변경 및 주문취소 버튼 비활성화 
  몇 번째 주문인지 index 전달받음 */
function changeStatus(cancelReq, index) {
  // 이게 몇 번째 주문상태인지 받아옴
  const $deliveryStep = document.querySelectorAll(".delivery-step")[index];
  // 이 주문의 cancelReq가 true라면, 주문 상태 '주문취소요청'으로 바꿔줘야함
  if (cancelReq) {
    $deliveryStep.textContent = "주문취소요청";
    // 바꿔줬으면 이 주문의 버튼들은 disabled 해주는 함수를 실행
    handleBtnByCancel(cancelReq, index);
  }
}

/* 2. cancelReq이 true면 버튼 disable 
  얘도 index 받아서 해당 주문 버튼만 disabled 해줘야한다.. 
  else(false일 경우 원상복귀) 안에 삭제해도 되는지 고민필요.. */
function handleBtnByCancel(cancelReq, index) {
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

/* 3. 배송 정보 저장 
  각 order 마다 실행되며, 해당 order의 배송지변경 modal 창에 주문자의 배송정보를 미리 입력해줌
  배송지 조회도 여기서 할 수 있음! 주문번호 눌러서 조회 가능하다면 참 좋을 것 같음.. */
function setShippingInfo(shippingInfo) {
  const $modalSection = document.querySelector(".modal-section");
  const {
    address,
    address_detail: addressDetail,
    phone_number: phoneNumber,
    postal_code: postalCode,
    recipient,
  } = shippingInfo;
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

/* 4. 주문내역이 없을 경우 확인: table row가 없을 경우를 확인한다. 
  비회원은 주문 내역이 없으면 조회불가하니까 회원만 사용할 듯 */
function handleNoOrderMessage() {
  const tableRows = document.querySelectorAll(".orderlist-tbody tr");
  if (tableRows.length < 1) {
    tableBody.innerHTML = `<tr class="no-order">
          <td colspan="6">주문 내역이 없습니다.</td>
        </tr>`;
  }
}

/* 5. 현재 화면에서의 배송지 변경 버튼 이벤트 등록
  주문이 여러개면, 버튼도 여러개이므로 change-address 이렇게 했는데.. 더 좋은 방법이 있을 듯 */
function handleChangeAddressButton() {
  const $orderlist = document.querySelector(".orderlist");

  /* 1. 이벤트리스너가 자꾸 중복등록되어서 중복등록 방지, 이벤트리스너가 등록되지 않았다면(!true) 등록한다
      1-A. dataset 설정해서 하는게 좋은 방법일까? 코치님께 여쭤보자
    2. 이벤트가 발생한 곳을 모달을 열어주는 함수로 전달해줌 */
  if ($orderlist && !$orderlist.dataset.eventListenerRegistered) {
    $orderlist.addEventListener("click", function (event) {
      if (event.target.classList.contains("change-address")) {
        const thisEvent = event;
        openChangeAddressModal(thisEvent);
      }
    });
    /* 이벤트리스너가 등록되었음을 설정 */
    $orderlist.dataset.eventListenerRegistered = true;
  }
}

/***** 배송지 변경 *****/
const overlay = document.querySelector(".overlay-modal");
const modal = document.querySelector(".change-address-modal");
const tableBody = document.querySelector(".orderlist-tbody");

/* A. 배송지 변경 모달 열기: 얘는 이벤트리스너에 등록된 함수니까 배송지 변경 요청 시에만 실행
  이벤트가 발생한 곳을 전달받아온다
  취소요청과 마찬가지로, 변경하고자 하는 row의 id를 가져온다 */
function openChangeAddressModal(event) {
  // const closestTr = event.target.closest("tr");
  // const orderIdTd = closestTr.querySelector("td:nth-child(4)");
  // const orderId = orderIdTd.textContent;

  const closestTr = event.target.closest("tr.row-border");
  // const orderIdTd = closestTr.querySelector("td:nth-child(4)");
  // const orderId = orderIdTd.textContent;
  const index = Array.from(
    closestTr.parentElement.getElementsByClassName("row-border")
  ).indexOf(closestTr);

  console.log(document.querySelectorAll(".row-border .order-id-td"));
  const $orderId = document.querySelectorAll(".row-border .order-id-td")[index];
  // const index = Array.from(
  //   closestTr.parentElement.getElementsByClassName("row-border")
  // ).indexOf(closestTr);
  const orderId = $orderId.textContent;
  overlay.style.display = "block";
  modal.style.display = "block";
  /* 1. 모달 확인 버튼 El 불러와서, 배송지 입력 후 input value를 불러온 후 PATCH를 날려준다 */
  const confirmButton = document.querySelector(".confirm-button");
  /* Comment: 이벤트핸들러가 중복 등록되어서 틀어막기식으로 조치해줬는데.. 해결방법 생각해봐야함 
    컨펌안하고 다시 취소눌렀을 때 추가 처리 코치님께 문의.. 
    dataset이랑 뭐가다른가 싶다 */
  /* 2. 배송지 변경 버튼 이벤트 등록할 때 처럼, 중복 이벤트핸들러 등록 방지
      2-A. cofirmButtonClickHandler 함수를 실행한다
      2-B. 변경하고자하는 row의 id를 가져왔으니, 변경(PATCH API)함수에 전달해준다
      2-C. 할 일 끝났으니, 중복등록 방지로 이 이벤트 리스너 지워줌
        - 확인 버튼을 한 화면에서 여러 번 누르니 PATCH가 여러 번 되기 때문에..  */
  const jwtJSON = window.localStorage.getItem(LOCALSTORAGE_JWT);
  if (jwtJSON) {
    fetch(`${API_URL}user/order`, {
      method: "GET",
      headers: {
        authorization: jwtJSON,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res.data;
        const filteredOrder = data.filter((order) => order._id === orderId);
        console.log("이게 먼저 나와야해");
        setShippingInfo(filteredOrder[0].shipping_info);
      });
  }
  // 데이터셋으로 해보려다가 실패..
  const confirmButtonClickHandler = function () {
    if (validation()) {
      return;
    }
    changeShippingAddress(orderId);
    closeChangeAddressModal();
    confirmButton.removeEventListener("click", confirmButtonClickHandler);
  };
  confirmButton.addEventListener("click", confirmButtonClickHandler);
  const $cancelButtonInModal = document.querySelector(".cancel-button");
  const $closeButton = document.querySelector(".close");
  $cancelButtonInModal.addEventListener("click", () => {
    confirmButton.removeEventListener("click", confirmButtonClickHandler);
  });
  $closeButton.addEventListener("click", () => {
    confirmButton.removeEventListener("click", confirmButtonClickHandler);
  });
}

/* B. 배송지 변경 PATCH API 함수 
  모달 열릴 때, 버튼이 클릭된 주문의 id 전달받아옴 */
/* Comment: 이름 update로 통일하면 좋을 듯 */
function changeShippingAddress(orderId) {
  const $nameInput = document.querySelector(".input-name input");
  const $phoneInput = document.querySelector(".input-phone input");
  const $postcodeInput = document.querySelector(".input-postcode input");
  const $addressInput = document.querySelector(".input-address input");
  const $addressDetailInput = document.querySelector(
    ".input-address-detail input"
  );

  /* ***  어떤 방법이 가장 좋을까? 고민  *** 
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

/***** 비회원 전용 : 주문 조회 
       회원이랑 로직 똑같아서 합쳐도 될 것 같은데.. 고민 필요... *****/
const $searchBtn = document.querySelector(".gol-btn");
$searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // display 작업 : 조회검색 창 사라지고, 주문조회 창 보여줌
  const $orderlist = document.querySelector(".orderlist");
  const $searchForm = document.querySelector(".inside");

  // 입력 값 : 띄어쓰기 생각해서 URL 인코딩해줘야함, 공백제거(trim())
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
      /*****  비회원 조회 data는 무조건 객체로만 오니까 배열로 감싸줌 *****/
      const data = [res.data];

      /* 회원 조회와 동일한 로직이고, 루프가 한 번만 돌지만 아래 함수들이 배열을 기준으로 작성되어있으니.. */
      data.forEach((order, index) => {
        const {
          order_items: orderItems,
          order_date: orderDate,
          _id: orderId,
          order_status: orderStatus,
          cancel_req: cancelReq,
          shipping_info: shippingInfo,
        } = order;
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
      /* 일치하는 주문이 없으면 바로 이곳으로 넘어올 것 */
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

/* 모달 닫기 함수 */
function closeChangeAddressModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

/* 모달 닫기 이벤트리스너 
 이거 함수로 만들어서 관리해야함 - 배송지 변경에도 사용하기 때문에.. */
const closeButton = document.querySelector(".close");
const cancelButtonInModal = document.querySelector(".cancel-button");
closeButton.addEventListener("click", closeChangeAddressModal);
cancelButtonInModal.addEventListener("click", closeChangeAddressModal);

/* 모달 외부 클릭 시 닫기 : 사용해보니 별로 안좋은 것 같음
overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closeChangeAddressModal();
  }
}); */

/***** 주문 취소 *****/
/* B. 주문 취소
   1. 취소하겠냐고 물어보고 맞다면, 
   2. 주문취소 API PATCH
   3. cancel_req를 true로 PATCH
   */
function cancelOrder(orderId, index) {
  const confirmCancel = confirm("주문을 취소하시겠습니까?");
  if (confirmCancel) {
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
        /* 4. res 데이터의 cancel_req 확인하여, true이면 배송상태를 취소요청으로 바꿔줌
          5. 이 취소 오더가 몇 번째 row인지를 전달받았으니, 해당 index에 대한 상태만 변경 */
        changeStatus(res.data.cancel_req, index);
        // DELETE되지 않으니 실행시키지 않아도 될 것 같음
        handleNoOrderMessage();
      })
      .catch((err) => console.log(err));
  }
}

// 주문취소 이벤트리스너 : 변경시켜야할까?
/* A. 주문조회 창이 다 렌더되면, 
  1. 주문취소 버튼 클릭 시, 
  2. 가장 가까운 table row 전체를 저장하고, 
  3. 4번째 자식인 주문번호를 찾고,
  4. 몇번째 취소버튼인지를 전달하기 위해 해당 table row의 부모를 배열화한 후,
  5. 이 row가 몇 번째 자식인지를 저장한다. 
  6. 4의 주문번호와 5의 index를 주문취소 함수에 전달해준다..
  너무 복잡한데 간결한 방법이 없는지 고민하거나.. 코치님께 문의하기.. */
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delivery-cancel")) {
    const closestTr = event.target.closest("tr.row-border");
    const orderIdTd = closestTr.querySelector("td:nth-child(4)");
    const orderId = orderIdTd.textContent;
    // console.log(
    //   Array.from(closestTr.parentElement.getElementsByClassName("row-border"))
    // );
    // console.log(
    //   Array.from(
    //     closestTr.parentElement.getElementsByClassName("row-border")
    //   ).indexOf(closestTr)
    // );
    const index = Array.from(
      closestTr.parentElement.getElementsByClassName("row-border")
    ).indexOf(closestTr);
    cancelOrder(orderId, index);
  }
  handleNoOrderMessage();
});

/* validation order.js 복붙 */
function validation() {
  const $nameInput = document.querySelector(".input-name input");
  const $phoneInput = document.querySelector(".input-phone input");
  const $postcodeInput = document.querySelector(".input-postcode input");
  const $addressInput = document.querySelector(".input-address input");
  const $addressDetailInput = document.querySelector(
    ".input-address-detail input"
  );
  if (!$nameInput.value.trim()) {
    alert("수령인 이름을 입력해주세요.");
    return true;
  }
  if (!$phoneInput.value.trim()) {
    alert("수령인 전화번호를 입력해주세요.");
    return true;
  }
  if (!$postcodeInput.value.trim()) {
    alert("수령인 우편번호를 입력해주세요.");
    return true;
  }

  if (!$addressInput.value.trim()) {
    alert("수령인 주소를 입력해주세요.");
    return true;
  }
  if (!$addressDetailInput.value.trim()) {
    alert("수령인 상세주소를 입력해주세요.");
    return true;
  }
  return false;
}
