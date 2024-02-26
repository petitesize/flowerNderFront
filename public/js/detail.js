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

  if (selectAgree.value === "0") {
    alert("교환 및 환불 동의 항목을 선택하세요.");
  } else {
    location.href = "./cart.html";
  }
}

// ================ 로컬스토리지 사용해서 담기 아직 데이터가 없기때문에 대충 만들어 놓음 ================


// *** 나중 개발~~
// vm 서버 올라가면 34..~~그거로 ..ㅎㅎ

const thisItemId = window.location.search.slice(2);
console.log(thisItemId);


const fetchDetailData = async () => {
  const res = await fetch(`http://localhost:8081/v1/products/${thisItemId}`, {
      method: 'GET',
  });
  
  const data = await res.json();
  const realData = data.data;
  console.log(realData);
  console.log(realData.category);

  const navWrap = document.querySelector('.nav-left')
  const detailContent = document.querySelector('.detail-content')

  const detailItemNav = `
  <a href="#">${realData.category}</a>
  `
  navWrap.insertAdjacentHTML('beforeend', detailItemNav);

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
          <div class="detail-lb-inner">
            <img
              src=${realData.sub_image[0].url}
              alt="다른상품 사진들"
              class="product-sub-img"
            />
          </div>
          <div class="detail-lb-inner">
            <img
              src=${realData.sub_image[0].url}
              alt="다른상품 사진들"
              class="product-sub-img"
            />
          </div>
          <div class="detail-lb-inner">
            <img
              src=${realData.sub_image[0].url}
              alt="다른상품 사진들"
              class="product-sub-img"
            />
          </div>
          <div class="detail-lb-inner">
            <img
              src=${realData.sub_image[0].url}
              alt="다른상품 사진들"
              class="product-sub-img"
            />
          </div>
          <div class="detail-lb-inner">
            <img
              src=${realData.sub_image[0].url}            
              alt="다른상품 사진들"
              class="product-sub-img"
            />
          </div>
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
            <h3>${realData.price}원</h3>
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
              <!-- *** 장바구니는 로컬스토리지로 연결~~~~ -->
              <div class="dcb-btn dcb-buy">
                <button type="button" class="buy-btn" onclick="goToBuy()">
                  구매하기
                </button>
                <button type="submit" class="buy-cart" onclick="addToCart()">
                  장바구니
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 주문안내와 배송안내 text들이 있는곳입니다.
            고정된 값이여서 추가개발 필요 X -->
    <div class="detail-b-text">
      <h4>주문안내</h4>
      <ul class="buy-info">
        <li>
          꽃은 살아있는 생물이므로 꽃 송이마다 화형, 색상 등이 다릅니다.
          따라서 배송 되는 상품은 이미지와 조금 차이가 날 수 있다는 점 양해
          부탁드립니다.
        </li>
        <li>
          꽃을 직접 가꾸는 즐거움을 느낄 수 있도록 가장 최소한의
          컨디셔닝으로만 작업 후 보내드립니다.
        </li>
        <li>
          꽃은 물에 꽂힌 상태로 수급&보관되고 있기에 줄기 하단의 이파리에
          상처가 생길 수 있습니다. 줄기 하단의 상처 있는 이파리는 제거하여
          보시길 추천드립니다.
        </li>
        <li>
          배송 과정에서 꽃이 지쳐 물 내림 현상이 발생할 수 있습니다. 꽃을
          받은 즉시 남아있는 이파리들을 제거해 주고 하루 정도 시원한 물을
          올려주면 꽃이 싱싱하게 살아날 수 있습니다.
        </li>
        <li>
          매일 오전 꽃 입고 및 검수 후, 꽃의 상태가 좋지 못하다면
          플로리스트의 판단하에 새로 수급되는 꽃으로 배송을 도와드립니다.
          따라서 선택하신 배송일보다 1~3일 정도 지연이 될 수 있다는 점 양해
          부탁드립니다.
        </li>
      </ul>
      <h4>배송안내</h4>
      <ul class="delivery-info">
        <li>
          택배 배송 특성상 정확한 배송 시간 안내와 배송 시간 조정이
          어렵습니다.
        </li>
        <li>
          제주도 및 일부 도서산간 지역은 지정하신 수령일 보다 1~2일 더
          소요될 수 있습니다
        </li>
        <li>
          CJ 대한통운을 통해 전국 배송이 가능합니다. (제주/도서산간 포함)
        </li>
        <li>
          배송 정보(실시간 배송 현황, 배송 완료 사진, 고객센터 전화번호
          등)는 카카오톡 알림 서비스를 통해 확인하실 수 있습니다
        </li>
      </ul>
    </div>
    `
    detailContent.insertAdjacentHTML('afterbegin', detailWrap);
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
        <div class="detail-lb-inner">
          <img
            src=${realData.sub_image[0].url}
            alt="다른상품 사진들"
            class="product-sub-img"
          />
        </div>
        <div class="detail-lb-inner">
          <img
            src=${realData.sub_image[0].url}
            alt="다른상품 사진들"
            class="product-sub-img"
          />
        </div>
        <div class="detail-lb-inner">
          <img
            src=${realData.sub_image[0].url}
            alt="다른상품 사진들"
            class="product-sub-img"
          />
        </div>
        <div class="detail-lb-inner">
          <img
            src=${realData.sub_image[0].url}
            alt="다른상품 사진들"
            class="product-sub-img"
          />
        </div>
        <div class="detail-lb-inner">
          <img
            src=${realData.sub_image[0].url}            
            alt="다른상품 사진들"
            class="product-sub-img"
          />
        </div>
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
          <h3>${realData.price}원</h3>
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
            <!-- *** 장바구니는 로컬스토리지로 연결~~~~ -->
            <div class="dcb-btn dcb-buy">
              <button type="button" class="buy-btn" onclick="goToBuy()">
                구매하기
              </button>
              <button type="submit" class="buy-cart" onclick="addToCart()">
                장바구니
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 주문안내와 배송안내 text들이 있는곳입니다.
          고정된 값이여서 추가개발 필요 X -->
  <div class="detail-b-text">
    <h4>주문안내</h4>
    <ul class="buy-info">
      <li>
        꽃은 살아있는 생물이므로 꽃 송이마다 화형, 색상 등이 다릅니다.
        따라서 배송 되는 상품은 이미지와 조금 차이가 날 수 있다는 점 양해
        부탁드립니다.
      </li>
      <li>
        꽃을 직접 가꾸는 즐거움을 느낄 수 있도록 가장 최소한의
        컨디셔닝으로만 작업 후 보내드립니다.
      </li>
      <li>
        꽃은 물에 꽂힌 상태로 수급&보관되고 있기에 줄기 하단의 이파리에
        상처가 생길 수 있습니다. 줄기 하단의 상처 있는 이파리는 제거하여
        보시길 추천드립니다.
      </li>
      <li>
        배송 과정에서 꽃이 지쳐 물 내림 현상이 발생할 수 있습니다. 꽃을
        받은 즉시 남아있는 이파리들을 제거해 주고 하루 정도 시원한 물을
        올려주면 꽃이 싱싱하게 살아날 수 있습니다.
      </li>
      <li>
        매일 오전 꽃 입고 및 검수 후, 꽃의 상태가 좋지 못하다면
        플로리스트의 판단하에 새로 수급되는 꽃으로 배송을 도와드립니다.
        따라서 선택하신 배송일보다 1~3일 정도 지연이 될 수 있다는 점 양해
        부탁드립니다.
      </li>
    </ul>
    <h4>배송안내</h4>
    <ul class="delivery-info">
      <li>
        택배 배송 특성상 정확한 배송 시간 안내와 배송 시간 조정이
        어렵습니다.
      </li>
      <li>
        제주도 및 일부 도서산간 지역은 지정하신 수령일 보다 1~2일 더
        소요될 수 있습니다
      </li>
      <li>
        CJ 대한통운을 통해 전국 배송이 가능합니다. (제주/도서산간 포함)
      </li>
      <li>
        배송 정보(실시간 배송 현황, 배송 완료 사진, 고객센터 전화번호
        등)는 카카오톡 알림 서비스를 통해 확인하실 수 있습니다
      </li>
    </ul>
  </div>
  `
  detailContent.insertAdjacentHTML('afterbegin', detailWrap);
  }
  
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
};

// ** cart 조회 후 값이 없을 경우에 빈 배열로 초기화해주는 방어 로직 추가!!
const localCart = JSON.parse(localStorage.getItem("cart")) || [];


if (localCart === null) {
  localStorage.setItem("cart", JSON.stringify([]));
}

cartButton.addEventListener("click", () => {
  localCart.push(cartSend);
  localStorage.setItem("cart", JSON.stringify(localCart));
});





}

fetchDetailData()




// ================  ***마우스 올렸을때의 이미지가 메인이미지 부분에 보이게 만들기 ================
// const mainImg = document.getElementById("product-main-img");
// const subImgs = document.querySelectorAll(".product-sub-img");

// ** 부모 컨테이너에 이벤트 위임하기!
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