// 퍼블리싱용 스크립트
const productList = document.getElementById('productList');
const moreButton = document.getElementById('moreButton');

moreButton.addEventListener('click', loadMoreProducts);

function loadMoreProducts() {
    // *** 일단 "MORE" 버튼 클릭 시 12개 추가 상품 보이도록함
    for (let i = 0; i < 12; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('list-wrap');
        listItem.innerHTML = `
            <div class="list-top">
                <a href="./detail.html">
                    <img src="/public/img/p5.jpeg" alt="제품사진1">
                </a>
            </div>
            <div class="list-bottom">
                <a href="./detail.html" class="list-title">DINING CHAIR</a>
                <p class="list-cg">MODERN</p>
                <p class="list-pay">2,300,000원</p>
                <!-- <div class="list-status">
                    <img src="/public/img/sold.jpg" alt="">
                </div> -->
            </div>
        `;
        productList.appendChild(listItem);
    }
}