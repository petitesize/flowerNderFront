// import { API_URL } from '/public/js/constants.js'

const getUsers = async () => {
  const res = await fetch('http://localhost:8081/v1/admin/users', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ACCESS_TOKEN',
    },
  })
  const datas = await res.json()
  const adminContainerEl = document.querySelector('.admin-container')
  datas.forEach(data => {
    adminContainerEl.insertAdjacentHTML(
      'beforeend',
      `
      <div class="admin-user-data">
      <p class="user-id-num">${data._id}</p>
      <p class="user-name">${data.user_name}</p>
      <p class="user-phone-num">${data.phone_number}</p>
      <p class="user-email">${data.email}</p>
    </div>
        `
    )
  })
}
getUsers()
