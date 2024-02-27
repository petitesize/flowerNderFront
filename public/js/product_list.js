// more 버튼 함수
const showMoreItems = () => {
    const listLi = document.querySelectorAll('#product-list li');

    // 숨겨진 리스트 중 다음 12개를 보여줌
    for (let i = 0; i < 12; i++) {
        const pulsLi = listLi[i + showItems];
        if (pulsLi) {
            pulsLi.style.display = 'block';
        } else {
            // 더 이상 보여줄 아이템이 없을 경우 버튼 숨김
            document.getElementById('more-btn').style.display = 'none';
            break;
        }
    }

    // 현재 보여지는 아이템 개수 업데이트
    showItems += 12;
};

// 더 보기 버튼에 이벤트 리스너 추가
document.getElementById('more-btn').addEventListener('click', showMoreItems);

// 초기에 보여지는 아이템의 개수
let showItems = 12;

// 초기에 8개 이상의 아이템이 있다면 더 보기 버튼 보이게 처리
if (document.querySelectorAll('#product-list li').length > showItems) {
    document.querySelector('.product-more').style.display = 'block';
}


const categoryList = async () => {
    //url 카테고리 key값!
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams:', urlParams);
    const category = urlParams.get('category');

    const res = await fetch('http://localhost:8081/api/v1/products', {
        method: 'GET',
    });
    const data = await res.json();
    const realData = data.data;

    const productList = document.querySelector('#product-list');
    const navList = document.querySelector('.nav-left');

    // 이전에 추가된 내용 모두 지우기
    navList.innerHTML = '';
    
    const categories = ['ALL', 'CUSTOM', 'MODERN', 'LOVELY', 'DESKTERIOR', 'CLASIC', 'ACC'];
    
    for (let i = 0; i < categories.length; i++) {
        let categoryLink;
        if (categories[i] === 'ALL') {
            categoryLink = `<a href="/index.html">${categories[i]}</a>`;
        } else {
            categoryLink = `<a href="/main/${categories[i].toLowerCase()}.html?category=${categories[i]}">${categories[i]}</a>`;
        }
    
        navList.insertAdjacentHTML('beforeend', categoryLink);
    }
    

// 각 링크에 클릭 이벤트 리스너 추가
const navLinks = navList.querySelectorAll('a');

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function(event) {
        // 모든 링크에서 nav-bold 클래스 제거
        for (let j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('nav-bold');
        }

        // 선택된 링크에 nav-bold 클래스 추가
        this.classList.add('nav-bold');
    });
}

    // ----------------------------- *** 카테고리에 해당하는 제품 list 가져오기
    for (let i = 0; i < realData.length; i++) {
        // 카테고리가 일치하는 경우에만 해당 상품을 보여줌 (대소문자 구별하지 않음)
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
}

categoryList();
