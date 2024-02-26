
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




const mainList = async () => {
    const res = await fetch('http://localhost:8081/v1/products', {
        method: 'GET',
    });
    const data = await res.json();
    const realData = data.data;
    console.log(realData);
    console.log(realData[0]._id);

    const productList = document.querySelector('#product-list');
    console.log(`/main/detail.html?=${realData[0]._id}`);
    for(let i = 0; i < realData.length; i++){
        const mainItem = `
        <li class="list-wrap" >
        <div class="list-top">
            <a href="/main/detail.html?=${realData[i]._id}">
                <img src=${realData[i].main_image.url} alt="제품사진1" class="productImage">
            </a>
        </div>
        <div class="list-bottom">
            <!-- *** 상품명 title -->
            <a href="/main/detail.html?=${realData[i]._id}" class="list-title">${realData[i].title}</a>
            <!--*** 카테고리명 들어감 -->
            <p class="list-cg">${realData[i].category}</p>
            <!-- *** 상품 가격 price -->
            <p class="list-pay">${realData[i].price}</p>
            <!-- *** 수량이 0이 되었을때 사진 띄워짐 sold -->
            <!-- <div class="list-status">
                <img src="/public/public/img/sold.jpg" alt="">
            </div> -->
        </div>
      </li>
        `
        // productList.innerHTML += mainItem
        productList.insertAdjacentHTML('beforeend', mainItem)

    }
}

mainList();