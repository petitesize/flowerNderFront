const instagramButton = document.querySelector('.instagram-button');
const question = document.getElementsByClassName('list-top');
const answer = document.getElementsByClassName('answer');
const upButton = document.getElementsByClassName('icon-up');
const downButton = document.getElementsByClassName('icon-down')

instagramButton.addEventListener('click', () => window.open('https://www.instagram.com/market.apf/'));

for (let i = 0; i < question.length; i++) {
    question[i].addEventListener('click', () => {
        answer[i].classList.toggle('off');
        upButton[i].classList.toggle('off');
        downButton[i].classList.toggle('off');
    })
}
