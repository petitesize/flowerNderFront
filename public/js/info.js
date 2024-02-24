const instagramButton = document.querySelector('.instagram-button');
const question = document.querySelectorAll('.list-top');
const answer = document.querySelectorAll('.answer');
const upButton = document.querySelectorAll('.icon-up');
const downButton = document.querySelectorAll('.icon-down');

instagramButton.addEventListener('click', () => window.open('https://www.instagram.com/market.apf/'));

for (let i = 0; i < question.length; i++) {
    question[i].addEventListener('click', () => {
        answer[i].classList.toggle('off');
        upButton[i].classList.toggle('off');
        downButton[i].classList.toggle('off');
    })
}
