import { API_URL } from '/public/js/constants.js';
// detail 페이지는 일단 오류나서 여기페이지는 나중에 import 할게요!!

// const thisItemId = window.location.search.slice(2);


// ========================= 추가함 가져온 url 넣고 get id 로 사용하기!
const url = window.location.href;
const URLSearch = new URL(url);
const getid = URLSearch.searchParams.get('id'); 


// ========================= API 불러오기 시작 =========================
const fetchDetailData = async () => {
    const res = await fetch(`${API_URL}products/${getid}`, {
        method: 'GET',
    });

    const data = await res.json();
    const realData = data.data;
    console.log(realData);
    console.log(realData.category);

    const navWrap = document.querySelector('.nav-left');

    // ----------------- **** nav에 가져온 카테고리명 넣기
    const goNavPage = `${realData.category.toLowerCase()}.html?category=${realData.category}`;
    const detailItemNav = `
  <a href=${goNavPage}>${realData.category}</a>
  `;
    navWrap.insertAdjacentHTML('beforeend', detailItemNav);

    // ========================= *** 상품목록 요소추가 시작 =======================
    // ----------------- 모든 상품 디테일에 적용됨
    if (realData.stock > 0) {
        // ----------------- 품절아닐경우
        // 메인 이미지 삽입
        const mainimg = document.querySelector('.main-img-box');
        mainimg.innerHTML = `<img src="${realData.main_image.url}" alt="상품사진" id="product-main-img" />`;

        // 서브이미지 삽입
        const subImageContainer = document.querySelector('.detail-l-bottom');

        // 서브이미지 배열이 있다고 가정
        const subImages = realData.sub_image;

        // 빈 박스 제거
        const emptyBoxes = document.querySelectorAll('.detail-lb-inner.sub-img-box');
        emptyBoxes.forEach((box) => box.remove());

        // 마우스 오버 이벤트 핸들러 함수
        function handleMouseEnter(mainimg, src, imageElement, previousHoveredElement) {
            mainimg.innerHTML = `<img src="${src}" alt="상품사진" id="product-main-img" />`;
            if (previousHoveredElement) {
                previousHoveredElement.classList.remove('hover');
            }
            imageElement.classList.add('hover');
            return imageElement;
        }

        // 서브이미지 삽입
        if (subImages && subImages.length > 0) {
            const maxSubImages = Math.min(subImages.length, 5);
            let previousHoveredElement = null;

            for (let i = 0; i < maxSubImages; i++) {
                const subImageElement = document.createElement('div');
                subImageElement.className = 'detail-lb-inner sub-img-box';

                const imageElement = document.createElement('img');
                imageElement.src = subImages[i].url;
                imageElement.alt = `서브이미지${i + 1}`;

                // 이미지 로딩이 끝나면 마우스 오버 이벤트 추가
                imageElement.addEventListener('load', function () {
                    imageElement.addEventListener('mouseenter', () => {
                        previousHoveredElement = handleMouseEnter(
                            mainimg,
                            imageElement.src,
                            imageElement,
                            previousHoveredElement
                        );
                    });
                });

                subImageElement.appendChild(imageElement);
                subImageContainer.appendChild(subImageElement);
            }
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
    } else {
        // ----------------- 품절일 경우

        // 메인 이미지 삽입
        const mainimg = document.querySelector('.main-img-box');
        mainimg.innerHTML = `<img src="${realData.main_image.url}" alt="상품사진" id="product-main-img" />`;

        // 서브이미지 삽입
        const subImageContainer = document.querySelector('.detail-l-bottom');

        // 서브이미지 배열이 있다고 가정
        const subImages = realData.sub_image;

        // 빈 박스 제거
        const emptyBoxes = document.querySelectorAll('.detail-lb-inner.sub-img-box');
        emptyBoxes.forEach((box) => box.remove());

        // 마우스 오버 이벤트 핸들러 함수
        function handleMouseEnter(mainimg, src, imageElement, previousHoveredElement) {
            mainimg.innerHTML = `<img src="${src}" alt="상품사진" id="product-main-img" />`;
            if (previousHoveredElement) {
                previousHoveredElement.classList.remove('hover');
            }
            imageElement.classList.add('hover');
            return imageElement;
        }

        // 서브이미지 삽입
        if (subImages && subImages.length > 0) {
            const maxSubImages = Math.min(subImages.length, 5);
            let previousHoveredElement = null;

            for (let i = 0; i < maxSubImages; i++) {
                const subImageElement = document.createElement('div');
                subImageElement.className = 'detail-lb-inner sub-img-box';

                const imageElement = document.createElement('img');
                imageElement.src = subImages[i].url;
                imageElement.alt = `서브이미지${i + 1}`;

                // 이미지 로딩이 끝나면 마우스 오버 이벤트 추가
                imageElement.addEventListener('load', function () {
                    imageElement.addEventListener('mouseenter', () => {
                        previousHoveredElement = handleMouseEnter(
                            mainimg,
                            imageElement.src,
                            imageElement,
                            previousHoveredElement
                        );
                    });
                });

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

    // ----------------- 카테고리 ACC에서 필요없는 요소들 안보이게 하기
    const realDataCategory = realData.category.toLowerCase();

    if (realDataCategory === 'acc') {
        // 숨길 요소들의 부모 요소를 찾아서 display 속성을 'none'으로 설정
        const accBoxes = document.querySelectorAll('.detail-flex.acc-box');
        accBoxes.forEach((box) => {
            box.style.display = 'none';
        });

        // acc-bottom 클래스를 가진 요소의 보더 탑을 없앰
        const accBottomElements = document.querySelectorAll('.acc-bottom');
        accBottomElements.forEach((element) => {
            element.style.borderTop = 'none';
        });
    }

    // ----------------- 카테고리 CUSTOM에서 필요없는 요소들 안보이게 하기
    if (realDataCategory === 'custom') {
        // 숨길 요소들의 부모 요소를 찾아서 display 속성을 'none'으로 설정
        const accBoxes = document.querySelectorAll('.detail-flex.custom-box');
        accBoxes.forEach((box) => {
            box.style.display = 'none';
        });
    }

    // ========================= *** 상품목록 요소추가 끝 =======================

    const cartButton = document.querySelector('.buy-cart');
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
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];

    cartButton.addEventListener('click', () => {
        // 동일한 상품이 이미 장바구니에 담겨있는지 확인
        const existingItemIndex = localCart.findIndex((item) => item.id === id);

        if (existingItemIndex !== -1) {
            // 이미 담긴 상품이라면 수량을 증가시킴
            localCart[existingItemIndex].quantity++;
        } else {
            // 새로운 상품이라면 카트에 추가
            localCart.push(cartSend);
        }

        fetchDetailData();
        // 로컬 스토리지에 저장
        const selectAgree = document.getElementById('selectAgree');

        if (selectAgree.value === '1') {
            localStorage.setItem('cart', JSON.stringify(localCart));
            location.href = './cart.html';
        } else {
            alert('교환 및 환불 동의 항목을 선택하세요.');
        }
    });
};
fetchDetailData();
// ========================= API 불러오기 끝 =========================
