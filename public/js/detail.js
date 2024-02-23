// ================  ***마우스 올렸을때의 이미지가 메인이미지 부분에 보이게 만들기 ================
const mainImg = document.getElementById('productMainImg');
const subImgs = document.querySelectorAll('.productSubImg');

subImgs.forEach(subImg => {
    subImg.addEventListener('mouseover', (e) => {
        mainImg.src = e.target.src;

        // 모든 서브이미지에만 클래스 제거
        subImgs.forEach(img => img.classList.remove('hover'));

        // 현재 마우스 올린 서비이미지에만 'hover' 클래스 추가
        subImg.classList.add('hover');
    });
});

// ================ 교환 환불 동의 셀렉트박스 선택안될시 얼럿창 ================
// ---------- 주문하기 버튼
function buyGo() {

    const selectAgree = document.getElementById('selectAgree');

    if (selectAgree.value === "0") {
        alert("교환 및 환불 동의 항목을 선택하세요.");
    } else {
    }
}
// ---------- 장바구니 담기 버튼
function cartGo() {

    const selectAgree = document.getElementById('selectAgree');

    if (selectAgree.value === "0") {
        alert("교환 및 환불 동의 항목을 선택하세요.");
    } else {
        location.href='./cart.html'
    }
}


// ================ 로컬스토리지 사용해서 담기 아직 데이터가 없기때문에 대충 만들어 놓음 ================

// *** 나중 개발~~
    // fetch('주소',)
    //     .then(res => res.json)
    //     .then(data => console.log(data))
        
        


const cartButton = document.querySelector('.buy-cart');
const title = "Dynastic tulip";
const price = '25,800원';
const mainImage = '/public/img/p1.jpeg';
const data = {
    title,
    price,
    mainImage,
};

const localCart = JSON.parse(localStorage.getItem('cart'));

if(localCart === null){
    localStorage.setItem('cart', JSON.stringify([]));
}


cartButton.addEventListener('click', () => {
    localCart.push(data)
    localStorage.setItem('cart', JSON.stringify(localCart))

})