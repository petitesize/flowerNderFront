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




  // ========================= 상품목록 템플릿 =======================

  // ----------------- 서브이미지를 동적으로 추가하기
function insertSubImages(subImages) {
  const subImagesContainer = document.querySelector('.detail-l-bottom');

  // ----------------- 이미지들을 순회하며 동적으로 추가
  subImages.forEach(subImage => {
      const subImageElement = document.createElement('div');
      subImageElement.classList.add('detail-lb-inner');

      const img = document.createElement('img');
      img.src = subImage.url;
      img.alt = '다른상품 사진들';
      img.classList.add('product-sub-img');

      subImageElement.appendChild(img);
      subImagesContainer.appendChild(subImageElement);
  });
}


// 전체 코드를 삽입하는 함수
function insertDetailWrap(realData) {
  const detailContent = document.querySelector('.detail-content');

  
  if(realData.stock > 0){
    //soldout이 없는 템플릿
    const detailWrap = `
    <!-- 상품 이미지 & 상품설명 + 상품선택이 있습니다! -->
    <div class="dc-top">
      <div class="detail-left">
        <!-- 이미지들 url로 한다고 하심 main_image -->
        <div class="detail-l-top">
          <img
            src=${realData.main_image.url}
            alt="상품사진"
            id="product-main-img"
          />
        </div>
        <!-- 서브이미지들 sub_image1~5 -->
        <div class="detail-l-bottom">
        </div>
      </div>
      <div class="detail-right">
        <div class="detail-r-top">
          <div class="detail-title">
            <!-- *** 상품의 이름! title -->
            <h2>${realData.title}</h2>
          </div>

          <!-- *** 상품의 가격! price -->
          <div class="detail-price">
            <h3>${realData.price.toLocaleString()}원</h3>
          </div>
          <!-- *** 상품 설명 description -->
          <div class="detail-info">
            <p>
              ${realData.description}
            </p>
          </div>
        </div>
        <div class="detail-r-mid">
          <div class="drm-top">
            <!-- 사이즈 size -->
            <div class="detail-flex df-two">
              <p class="dft-title">Volume</p>
              <span class="dft-text">${realData.size}</span>
            </div>
            <!-- 원산지! origin -->
            <div class="detail-flex df-two">
              <p class="dft-title">Origin</p>
              <span class="dft-text">${realData.origin}</span>
            </div>
          </div>

          <div class="drm-bottom">
            <div class="detail-flex df-two">
              <!-- 꽃의 특징이 들어가는곳! attribute -->
              <p class="dft-title">특성</p>
              <span class="dft-text"
                >${realData.attribute}
              </span>
            </div>

            <!-- 고정된 텍스트들 개발필요 x -->
            <div class="detail-flex df-two">
              <p class="dft-title">상세 내용</p>
              <span class="dft-text"
                >꽃, 이렇게 배송 돼요. Flora & Dér 꽃시장은 국내 농장의
                신선한 꽃을 최소한의 컨디셔닝만 거쳐 보내드립니다. 배송
                중에도 꽃에 물을 공급하기 위해 플로럴 폼(오아시스)을
                사용합니다. 꽃을 보호하기 위해 포장지로 감싸고 Flora & Dér
                시그니처 로고가 적용된 패키지에 담아 배송됩니다.
              </span>
            </div>
            <div class="detail-flex df-two">
              <p class="dft-title">컨디셔닝</p>
              <span class="dft-text"
                >잎은 꽃받침 아래 2~3개를 제외하고 전부 제거하여 물에 잠기는
                부분에 잎이 없도록 합니다. 잎 정리 후 줄기의 끝부분을 잘라
                물에 담가줍니다.
              </span>
            </div>
            <div class="detail-flex df-two">
              <p class="dft-title">관리 방법</p>
              <span class="dft-text"
                >신선한 물로 화병을 자주 갈아 주며, 줄기 끝을 다시 잘라
                수화작용을 원활하게 해주세요.
              </span>
            </div>
          </div>
        </div>
        <div class="detail-r-bottom">
          <p class="detail-warning">
            ※ 구매 수량에 따라 배송되는 박스는 이미지와 다를 수 있습니다.
          </p>
          <div class="detail-delivery">
            <p class="dd-title">배송비</p>
            <p class="dd-text">착불</p>
          </div>
          <div class="detail-choice">
            <div class="dc-inner dc-sel-top">
              <p>필수 선택 *</p>
              <select name="selectAgree" id="selectAgree" required>
                <option value="0">교환 및 환불 동의</option>
                <option value="1">
                  제품을 개봉하거나 상품가치가 훼손된 경우에는 제품의 교환
                  및 환불 불가 안내에 동의합니다.
                </option>
              </select>
            </div>

            <div class="dc-bottom">
              <!-- *** 장바구니는 로컬스토리지로 연결~~~~ -->
              <div class="dcb-btn dcb-buy">
                <button type="submit" class="buy-cart" onclick="addToCart()">
                  장바구니
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   `
    detailContent.insertAdjacentHTML('afterbegin', detailWrap);


        // 서브이미지 추가 함수 호출
        insertSubImages(realData.sub_image);
  }else{
  //soldout이 있는 템플릿
  const detailWrap = `
  <!-- 상품 이미지 & 상품설명 + 상품선택이 있습니다! -->
  <div class="dc-top">
    <div class="detail-left">
      <!-- 이미지들 url로 한다고 하심 main_image -->
      <div class="detail-l-top">
        <img
          src=${realData.main_image.url}
          alt="상품사진"
          id="product-main-img"
        />
      </div>
      <!-- 서브이미지들 sub_image1~5 -->
      <div class="detail-l-bottom">
      </div>
    </div>
    <div class="detail-right">
      <div class="detail-r-top">
        <div class="detail-title">
          <!-- *** 상품의 이름! title -->
          <h2>${realData.title}</h2>
          <img src="/public/img/sold.jpg" alt="" />
        </div>

        <!-- *** 상품의 가격! price -->
        <div class="detail-price">
          <h3>${realData.price.toLocaleString()}원</h3>
        </div>
        <!-- *** 상품 설명 description -->
        <div class="detail-info">
          <p>
            ${realData.description}
          </p>
        </div>
      </div>
      <div class="detail-r-mid">
        <div class="drm-top">
          <!-- 사이즈 size -->
          <div class="detail-flex df-two">
            <p class="dft-title">Volume</p>
            <span class="dft-text">${realData.size}</span>
          </div>
          <!-- 원산지! origin -->
          <div class="detail-flex df-two">
            <p class="dft-title">Origin</p>
            <span class="dft-text">${realData.origin}</span>
          </div>
        </div>

        <div class="drm-bottom">
          <div class="detail-flex df-two">
            <!-- 꽃의 특징이 들어가는곳! attribute -->
            <p class="dft-title">특성</p>
            <span class="dft-text"
              >${realData.attribute}
            </span>
          </div>

          <!-- 고정된 텍스트들 개발필요 x -->
          <div class="detail-flex df-two">
            <p class="dft-title">상세 내용</p>
            <span class="dft-text"
              >꽃, 이렇게 배송 돼요. Flora & Dér 꽃시장은 국내 농장의
              신선한 꽃을 최소한의 컨디셔닝만 거쳐 보내드립니다. 배송
              중에도 꽃에 물을 공급하기 위해 플로럴 폼(오아시스)을
              사용합니다. 꽃을 보호하기 위해 포장지로 감싸고 Flora & Dér
              시그니처 로고가 적용된 패키지에 담아 배송됩니다.
            </span>
          </div>
          <div class="detail-flex df-two">
            <p class="dft-title">컨디셔닝</p>
            <span class="dft-text"
              >잎은 꽃받침 아래 2~3개를 제외하고 전부 제거하여 물에 잠기는
              부분에 잎이 없도록 합니다. 잎 정리 후 줄기의 끝부분을 잘라
              물에 담가줍니다.
            </span>
          </div>
          <div class="detail-flex df-two">
            <p class="dft-title">관리 방법</p>
            <span class="dft-text"
              >신선한 물로 화병을 자주 갈아 주며, 줄기 끝을 다시 잘라
              수화작용을 원활하게 해주세요.
            </span>
          </div>
        </div>
      </div>
      <div class="detail-r-bottom">
        <p class="detail-warning">
          ※ 구매 수량에 따라 배송되는 박스는 이미지와 다를 수 있습니다.
        </p>
        <div class="detail-delivery">
          <p class="dd-title">배송비</p>
          <p class="dd-text">착불</p>
        </div>
        <div class="detail-choice">
          <div class="dc-inner dc-sel-top">
            <p>필수 선택 *</p>
            <select name="selectAgree" id="selectAgree" required>
              <option value="0">교환 및 환불 동의</option>
              <option value="1">
                제품을 개봉하거나 상품가치가 훼손된 경우에는 제품의 교환
                및 환불 불가 안내에 동의합니다.
              </option>
            </select>
          </div>

          <div class="dc-bottom">
            <div class="dcb-btn dcb-soldout">
              <button type="button">품절된상품입니다.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
  detailContent.insertAdjacentHTML('afterbegin', detailWrap);

        // 서브이미지 추가 함수 호출
        insertSubImages(realData.sub_image);
  }
  
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