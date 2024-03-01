// ================ 상품목록 api 불러오기! ================
const categoryList = async () => {
    
    //url 카테고리 key값!
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams:', urlParams);
    const category = urlParams.get('category');

    const res = await fetch('http://localhost:8080/api/v1/products', {
        method: 'GET',
    });
    const data = await res.json();
    const realData = data.data;

    const productList = document.querySelector('#product-list');
    const navList = document.querySelector('.nav-left');

    // 이전에 추가된 내용 모두 지우기
    navList.innerHTML = '';
    
    const categories = ['ALL', 'CUSTOM', 'MODERN', 'LOVELY', 'DESKTERIOR', 'CLASSIC', 'ACC'];
    
    for (let i = 0; i < categories.length; i++) {
        let categoryLink;
        if (categories[i] === 'ALL') {
            // 만약 카테고리가 all 이라면 해당 링크로 이동
            categoryLink = `<a href="/index.html">${categories[i]}</a>`;
        } else {
            // 다른 카테고리일경우 해당하는 곳으로 이동
            categoryLink = `<a href="/main/${categories[i].toLowerCase()}.html?category=${categories[i]}">${categories[i]}</a>`;
        }
        navList.insertAdjacentHTML('beforeend', categoryLink);
    }
    

    // ----------------------------- *** 카테고리에 해당하는 제품 list 가져오기
    for (let i = 0; i < realData.length; i++) {
        // 카테고리가 일치하는 경우에만 해당 상품을 보여줌 (대소문자 구별X)
        const stockImage = realData[i].stock > 0 ? '' : '<img src="/public/img/sold.jpg" alt="">';
        if (realData[i].category.toLowerCase() === category.toLowerCase()) {
            const mainItem = `
            <li class="list-wrap">
                <div class="list-top">
                    <a href="/main/detail.html?=${realData[i]._id}">
                        <img src=${realData[i].main_image.url} alt="제품사진1" class="productImage">
                    </a>
                </div>
                <div class="list-bottom">
                    <a href="/main/detail.html?=${realData[i]._id}" class="list-title">${realData[i].title}</a>
                    <p class="list-cg">${realData[i].category}</p>
                    <p class="list-pay">${realData[i].price}</p>
                    <!-- *** 수량이 0이 되었을때 사진 띄워짐 sold -->
                    <div class="list-status">
                        ${stockImage}
                    </div>
                </div>
            </li>
            `;
            productList.insertAdjacentHTML('beforeend', mainItem);
        }
    }

// ================ 상품 list가 12개 이상이면 more 버튼 보이게 하기 ================
let showItems = 12;

const showMoreItems = () => {
    const listLi = document.querySelectorAll('#product-list li');

    // 숨겨진 리스트 중 다음 12개를 보여줌
    for (let i = showItems; i < showItems + 12; i++) {
        const pulsLi = listLi[i];

        if (pulsLi) {
            pulsLi.style.display = 'block';
        }
    }

    // 현재 보여지는 아이템 개수 업데이트
    showItems += 12;
    console.log(showItems);

    if (listLi.length <= showItems) {
        // 더 이상 보여줄 아이템이 없을 경우 버튼 숨김
        document.querySelector('.product-more').style.display = 'none';
    }
};

// -------------- 더 보기 버튼에 이벤트 리스너 showMoreItems 추가하기!!!
document.querySelector('.product-more').addEventListener('click', showMoreItems);

// 초기에 12개 미만이면 버튼 숨김
if (document.querySelectorAll('#product-list li').length <= showItems) {
    document.querySelector('.product-more').style.display = 'none';
}



}

categoryList();

