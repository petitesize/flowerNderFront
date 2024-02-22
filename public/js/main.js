
// more 버튼 함수
const showMoreItems = () => {
    const listLi = document.querySelectorAll('#productList li');

    // 숨겨진 리스트 중 다음 12개를 보여줌
    for (let i = 0; i < 12; i++) {
        const pulsLi = listLi[i + showItems];
        if (pulsLi) {
            pulsLi.style.display = 'block';
        } else {
            // 더 이상 보여줄 아이템이 없을 경우 버튼 숨김
            document.getElementById('moreButton').style.display = 'none';
            break;
        }
    }

    // 현재 보여지는 아이템 개수 업데이트
    showItems += 12;
};

// 더 보기 버튼에 이벤트 리스너 추가
document.getElementById('moreButton').addEventListener('click', showMoreItems);

// 초기에 보여지는 아이템의 개수
let showItems = 12;

// 초기에 8개 이상의 아이템이 있다면 더 보기 버튼 보이게 처리
if (document.querySelectorAll('#productList li').length > showItems) {
    document.querySelector('.product-more').style.display = 'block';
}
