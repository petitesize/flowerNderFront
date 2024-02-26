const getUsers = async () => {
  const res = await fetch('http://localhost:8081/v1/admin/users', {
    method: 'GET',
  })
  const datas = await res.json()
  const adminContainerEl = document.querySelector('.admin-container')
  datas.forEach((data, i) => {
    adminContainerEl.insertAdjacentHTML(
      'beforeend',
      `
      <div class="admin-user-data">
      <p class="user-id-num">${data[i]._id}</p>
      <p class="user-name">${data[i].user_name}</p>
      <p class="user-phone-num">${data[i].phone_number}</p>
      <p class="user-email">${data[i].email}</p>
    </div>
        `
    )
  })
}
getUsers()
