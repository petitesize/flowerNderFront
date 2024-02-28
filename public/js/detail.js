// import { API_URL } from "/public/js/constants.js";
// detail 페이지는 일단 오류나서 여기페이지는 나중에 import 할게요!!




// ================ 교환 환불 동의 셀렉트박스 선택안될시 얼럿창 ================
// ---------- 주문하기 버튼
function goToBuy() {
  const selectAgree = document.getElementById("selectAgree");

  if (selectAgree.value === "0") {
    alert("교환 및 환불 동의 항목을 선택하세요.");
  }
}
// goToBuy()
// ---------- 장바구니 담기 버튼
function addToCart() {
  console.log("addToCart 함수 호출"); // 디버깅을 위한 콘솔 로그
  const selectAgree = document.getElementById("selectAgree");

  // if (selectAgree.value === "0") {
  //   alert("교환 및 환불 동의 항목을 선택하세요.");
  // } else {
  //   location.href = "./cart.html";
  // }
}

// ================ 로컬스토리지 사용해서 담기 아직 데이터가 없기때문에 대충 만들어 놓음 ================


// *** 나중 개발~~
// vm 서버 올라가면 34..~~그거로 ..ㅎㅎ

const thisItemId = window.location.search.slice(2);
console.log(thisItemId);


const fetchDetailData = async () => {
  const res = await fetch(`http://localhost:8081/api/v1/products/${thisItemId}`, {
      method: 'GET',
  });
  
  const data = await res.json();
  const realData = data.data;
  console.log(realData);
  console.log(realData.category);

  const navWrap = document.querySelector('.nav-left')
  const detailContent = document.querySelector('.detail-content')


  // ----------------- **** nav에 가져온 카테고리명 넣기
  const detailItemNav = `
  <a href="#">${realData.category}</a>
  `
  navWrap.insertAdjacentHTML('beforeend', detailItemNav);


  // ========================= 상품목록 템플릿 너무 길어져서 요소 추가하는걸로 수정함 =======================

  // ----------------- 재고가 0일때


if(realData.stock > 0){
  // ----------------- 품절아닐경우
  // 메인 이미지 삽입
  const mainimg = document.querySelector('.main-img-box');
  mainimg.innerHTML = `<img src="${realData.main_image.url}" alt="상품사진" id="product-main-img" />`;

  // 서브이미지 삽입
  // 서브이미지 삽입// 서브이미지 삽입
  const subImageContainer = document.querySelector('.detail-l-bottom');

  // 서브이미지 배열이 있다고 가정
  const subImages = realData.sub_image;

  // 빈 박스 제거
  const emptyBoxes = document.querySelectorAll('.detail-lb-inner.sub-img-box');
  emptyBoxes.forEach(box => box.remove());

  if (subImages && subImages.length > 0) {
    const maxSubImages = Math.min(subImages.length, 5);

    for (let i = 0; i < maxSubImages; i++) {
      const subImageElement = document.createElement('div');
      subImageElement.className = 'detail-lb-inner sub-img-box';

      const imageElement = document.createElement('img');
      imageElement.src = subImages[i].url;
      imageElement.alt = `서브이미지${i + 1}`;

      subImageElement.appendChild(imageElement);
      subImageContainer.appendChild(subImageElement);
    }
  } else {
    // 서브이미지가 없는 경우에 대한 처리
    const noSubImageElement = document.createElement('p');
    noSubImageElement.textContent = '서브이미지가 없습니다.';
    subImageContainer.appendChild(noSubImageElement);
  }

  // 제목 삽입
  const titleElement = document.querySelector('.title-box');
  titleElement.innerHTML = `${realData.title}`;

  // 가격 삽입
  const priceElement = document.querySelector('.price-box');
  priceElement.innerHTML = `${realData.price.toLocaleString()}원`;

  // 상품 설명 삽입
  const descriptionElement = document.querySelector('.description-box');
  descriptionElement.innerHTML = `${realData.description}`;

  // 사이즈 삽입
  const sizeElement = document.querySelector('.volume-box');
  sizeElement.textContent = realData.size;

  // 원산지 삽입
  const originElement = document.querySelector('.origin-box');
  originElement.textContent = realData.origin;

  // 특성 삽입
  const attributeElement = document.querySelector('.attribute-box');
  attributeElement.textContent = realData.attribute;

  document.querySelector('.sold-out-img').style.display = 'none';
  document.querySelector('.dcb-soldout').style.display = 'none';
}else {
  // ----------------- 품절일 경우 

  // 메인 이미지 삽입
  const mainimg = document.querySelector('.main-img-box');
  mainimg.innerHTML = `<img src="${realData.main_image.url}" alt="상품사진" id="product-main-img" />`;
  
  
  // 서브이미지 삽입
  // 서브이미지 삽입// 서브이미지 삽입
  const subImageContainer = document.querySelector('.detail-l-bottom');
  
  // 서브이미지 배열이 있다고 가정
  const subImages = realData.sub_image;
  
  // 빈 박스 제거
  const emptyBoxes = document.querySelectorAll('.detail-lb-inner.sub-img-box');
  emptyBoxes.forEach(box => box.remove());
  
  if (subImages && subImages.length > 0) {
    const maxSubImages = Math.min(subImages.length, 5);
  
    for (let i = 0; i < maxSubImages; i++) {
      const subImageElement = document.createElement('div');
      subImageElement.className = 'detail-lb-inner sub-img-box';
  
      const imageElement = document.createElement('img');
      imageElement.src = subImages[i].url;
      imageElement.alt = `서브이미지${i + 1}`;
  
      subImageElement.appendChild(imageElement);
      subImageContainer.appendChild(subImageElement);
    }
  } else {
    // 서브이미지가 없는 경우에 대한 처리
    const noSubImageElement = document.createElement('p');
    noSubImageElement.textContent = '서브이미지가 없습니다.';
    subImageContainer.appendChild(noSubImageElement);
  }
  
  // 제목 삽입
  const titleElement = document.querySelector('.title-box');
  titleElement.innerHTML = `${realData.title}`;
  
  // 가격 삽입
  const priceElement = document.querySelector('.price-box');
  priceElement.innerHTML = `${realData.price.toLocaleString()}원`;
  
  // 상품 설명 삽입
  const descriptionElement = document.querySelector('.description-box');
  descriptionElement.innerHTML = `${realData.description}`;
  
  // 사이즈 삽입
  const sizeElement = document.querySelector('.volume-box');
  sizeElement.textContent = realData.size;
  
  // 원산지 삽입
  const originElement = document.querySelector('.origin-box');
  originElement.textContent = realData.origin;
  
  // 특성 삽입
  const attributeElement = document.querySelector('.attribute-box');
  attributeElement.textContent = realData.attribute;
  
  document.querySelector('.dcb-buy').style.display = 'none';
}


insertDetailWrap(realData);
  const cartButton = document.querySelector(".buy-cart");
const id = realData._id;
const price = realData.price;
const title = realData.title;
const mainImage = realData.main_image.url;

const cartSend = {
  id,
  title,
  price,
  mainImage,
  quantity: 1, // 최초 추가시 수량 1로 설정
};

// 기존에 저장된 카트 정보 가져오기
const localCart = JSON.parse(localStorage.getItem("cart")) || [];

cartButton.addEventListener("click", () => {
  // 동일한 상품이 이미 장바구니에 담겨있는지 확인
  const existingItemIndex = localCart.findIndex((item) => item.id === id);

  if (existingItemIndex !== -1) {
    // 이미 담긴 상품이라면 수량을 증가시킴
    localCart[existingItemIndex].quantity++;
  } else {
    // 새로운 상품이라면 카트에 추가
    localCart.push(cartSend);
  }

  // 로컬 스토리지에 저장
  const selectAgree = document.getElementById("selectAgree");

  if (selectAgree.value === "1") {
    localStorage.setItem("cart", JSON.stringify(localCart));
    location.href = "./cart.html";
  } else {
    alert("교환 및 환불 동의 항목을 선택하세요.");
  }
  
});





}

fetchDetailData()




// ================  ***마우스 올렸을때의 이미지가 메인이미지 부분에 보이게 만들기 ================
// const mainImg = document.getElementById("product-main-img");
// const subImgs = document.querySelectorAll(".product-sub-img");

// // ** 부모 컨테이너에 이벤트 위임하기!
// document.querySelector('.detail-left').addEventListener('mouseover', (e) => {
//     const targetImg = e.target;
//     if (targetImg.classList.contains('product-sub-img')) {
//         mainImg.src = targetImg.src;

//         // 모든 subImgs에서 'hover' 클래스 제거
//         subImgs.forEach((img) => img.classList.remove('hover'));

//         // 현재 subImg에 'hover' 클래스 추가
//         targetImg.classList.add('hover');
//     }
// });