//logOut
const logOut_btn = document.querySelector('.logOut-btn')
logOut_btn.addEventListener('click', () => {
  localStorage.removeItem('jwt')
})
