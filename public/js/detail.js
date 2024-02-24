import { API_URL } from "/public/js/constants.js";

// ================  ***마우스 올렸을때의 이미지가 메인이미지 부분에 보이게 만들기 ================
const mainImg = document.getElementById("product-main-img");
const subImgs = document.querySelectorAll(".product-sub-img");

// ** 부모 컨테이너에 이벤트 위임하기!
document.querySelector('.detail-left').addEventListener('mouseover', (e) => {
    const targetImg = e.target;
    if (targetImg.classList.contains('product-sub-img')) {
        mainImg.src = targetImg.src;

        // 모든 subImgs에서 'hover' 클래스 제거
        subImgs.forEach((img) => img.classList.remove('hover'));

        // 현재 subImg에 'hover' 클래스 추가
        targetImg.classList.add('hover');
    }
});


// ================ 교환 환불 동의 셀렉트박스 선택안될시 얼럿창 ================
// ---------- 주문하기 버튼
function goToBuy() {
  const selectAgree = document.getElementById("selectAgree");

  if (selectAgree.value === "0") {
    alert("교환 및 환불 동의 항목을 선택하세요.");
  }
}
// ---------- 장바구니 담기 버튼
function addToCart() {
  console.log("addToCart 함수 호출"); // 디버깅을 위한 콘솔 로그
  const selectAgree = document.getElementById("selectAgree");

  if (selectAgree.value === "0") {
    alert("교환 및 환불 동의 항목을 선택하세요.");
  } else {
    location.href = "./cart.html";
  }
}

// ================ 로컬스토리지 사용해서 담기 아직 데이터가 없기때문에 대충 만들어 놓음 ================

// *** 나중 개발~~
// vm 서버 올라가면 34..~~그거로 ..ㅎㅎ
fetch(`${API_URL}products`, {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => console.log(data));

const cartButton = document.querySelector(".buy-cart");
const title = "Dynastic tulip";
const price = "25,800원";
const mainImage = "/public/img/p1.jpeg";
const data = {
  title,
  price,
  mainImage,
};

// ** cart 조회 후 값이 없을 경우에 빈 배열로 초기화해주는 방어 로직 추가!!
const localCart = JSON.parse(localStorage.getItem("cart")) || [];


if (localCart === null) {
  localStorage.setItem("cart", JSON.stringify([]));
}

cartButton.addEventListener("click", () => {
  localCart.push(data);
  localStorage.setItem("cart", JSON.stringify(localCart));
});
