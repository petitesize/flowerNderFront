import { API_URL } from '/public/js/constants.js'
const token = localStorage.getItem('jwt')
if (!token) {
  alert('관리자 계정으로 접속해 주세요')
}

const getProducts = async () => {
  const token = localStorage.getItem('jwt')
  const res = await fetch(`${API_URL}admin/products`, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  })
  if (!res.ok) {
    throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.')
  }

  const productsDatas = await res.json()
  // JWT 만료 여부 검사
  if (productsDatas.error === 'jwt expired') {
    localStorage.removeItem('jwt')
    alert('로그인 인증이 만료되었습니다.')
    location.href = '/user/login.html'
    return false
  }
  const adminContainerEl = document.querySelector('.admin-container')
  productsDatas.data.forEach(data => {
    adminContainerEl.insertAdjacentHTML(
      'beforeend',
      `
      <div class="admin-product-data">
          <p class="product-id">${data._id}</p>
          <p class="product-category">${data.category}</p>
          <p class="product-title">${data.title}</p>
          <img src="${data.main_image.url}" class="product-img"></img>
          <p class="product-price">${data.price}</p>
          <p class="product-stock">${data.stock}</p>
          <p class="product-description">${data.description.slice(0, 30)}...</p>
          <p class="product-size">${data.size}</p>
          <p class="product-origin">${data.origin}</p>
          <p class="product-attribute">${data.attribute.slice(0, 30)}...</p>
          <div>
            <button class="btn product-update">상품수정</button>
            <button class="btn product-delete">상품삭제</button>
          </div>
        </div>
      `
    )
  })
}
getProducts()

// 상품 추가 버튼 이벤트 리스너
const productAddBtn = document.querySelector('.product-add')
if (productAddBtn) {
  productAddBtn.addEventListener('click', handleCreateProduct)
}

// 관리자 데이터에서 발생하는 클릭 이벤트 처리
const adminContainer = document.querySelector('.admin-container')
if (adminContainer) {
  adminContainer.addEventListener('click', e => {
    if (e.target.className.includes('product-cancel')) {
      handleProductAddCancel(e)
    } else if (e.target.className.includes('product-create')) {
      handleCreateBtn(e)
    } else if (e.target.className.includes('product-update')) {
      handleUpdateProduct(e)
    } else if (e.target.className.includes('product-delete')) {
      handleDeleteProduct(e)
    } else if (e.target.className.includes('update-cancel')) {
      handleUpdateCancel(e)
    } else if (e.target.className.includes('update-save')) {
      handleUpdateSave(e)
    }
  })
}

function handleCreateProduct() {
  // 상품 추가 UI 생성
  // 상품 생성 UI 핸들러

  const productHtml = `
  <div class="admin-product-data">
      <div></div>
      <select class="product-input category">
        <option value="Custom">Custom</option>
        <option value="Modern">Modern</option>
        <option value="Lovely">Lovely</option>
        <option value="Deskterior">Deskterior</option>
        <option value="Classic">Classic</option>
        <option value="Acc">Acc</option>
      </select>
      <input / class="product-input title" type='text' placeholder="제품명 입력">
      <label for="input-img" class="img-label">이미지첨부(최대 6개)</label>
      <input / class="product-input image" id="input-img" type='file' name='images' accept='image/*' multiple>
      <input / class="product-input price" type='number' placeholder="가격 입력">
      <input / class="product-input stock" type='number' placeholder="재고 입력">
      <textarea class="product-input description" rows=2 cols=25 placeholder="제품 상세 설명 입력"></textarea>
      <select class="product-input size">
        <option value="Large">Large</option>
        <option value="Medium">Medium</option>
        <option value="Small">Small</option>
        <option value="One-Size">One-Size</option>
      </select>
      <select class="product-input origin">
        <option value="한국">한국</option>
        <option value="남아공">남아공</option>
        <option value="네덜란드">네덜란드</option>
        <option value="베트남">베트남</option>
        <option value="이스라엘">이스라엘</option>
        <option value="에티오피아">에티오피아</option>
        <option value="이탈리아">이탈리아</option>
        <option value="일본">일본</option>
        <option value="중국">중국</option>
        <option value="짐바브웨">짐바브웨</option>
        <option value="베트남">베트남</option>
        <option value="케냐">케냐</option>
        <option value="콜롬비아">콜롬비아</option>
        <option value="탄자니아">탄자니아</option>
        <option value="프랑스">프랑스</option>
        <option value="호주">호주</option>
      </select>
      <textarea class="product-input attribute" rows=2 cols=25 placeholder="제품 특징 입력"></textarea>
    <div>
      <button class="btn product-create">생성</button>
      <button class="btn product-cancel">취소</button>
    </div>
  </div>
  `
  // 상품 추가 HTML 생성 함수 호출
  adminContainer.insertAdjacentHTML('beforeend', productHtml)
  productAddBtn.style.display = 'none'
}

function handleProductAddCancel(e) {
  // 상품 추가 취소
  e.target.closest('.admin-product-data').remove()
  document.querySelector('.product-add').style.display = 'block'
}

function handleCreateBtn(e) {
  // 상품 생성 버튼 클릭 처리
  // 입력 받은 데이터 수집 및 올바르게 적었는지 검사 후 서버로 POST 요청
  if (!e.target.classList.contains('product-create')) return

  // 생성버튼을 올바르게 눌렀다면 ↓실행
  // 요소 선택을 위한 helper 함수
  function select(selector) {
    return document.querySelector(selector)
  }
  // 필수 입력 필드 선택
  const title = select('.title')
  const price = select('.price')
  const stock = select('.stock')
  const description = select('.description')
  const attribute = select('.attribute')
  const category = select('.category')
  const size = select('.size')
  const origin = select('.origin')
  const image = select('.image')

  // 제품 생성할 때 input 올바르게 작성했는지 검사
  if (
    !title.value ||
    !title.value.trim() ||
    !price.value ||
    !price.value.trim() ||
    image.files.length > 6 ||
    !stock.value ||
    !stock.value.trim() ||
    !description ||
    !description.value.trim() ||
    !attribute.value ||
    !attribute.value.trim()
  ) {
    alert('빈칸을 전부 작성하셔야 생성 가능합니다.(이미지 최대 6개)')
    return
  }

  // 이미지 파일 추가 (메인 이미지와 서브 이미지를 포함하여 모두 같은 input에서 선택)

  // const datas = {
  //   category: 'Custom',
  //   title: 'Awesome Product',
  //   price: 30000,
  //   stock: 45,
  //   description: 'This is an amazing product with great features.',
  //   size: 'Large',
  //   origin: 'korea',
  //   attribute: '튤립은 ~~특징이 있어요~',
  //   main_image: {
  //     url: 'https://ibb.co/4Mv17pm',
  //     alt: '',
  //   },
  //   sub_image: [
  //     {
  //       url: 'https://ibb.co/rby4m2f',
  //       alt: '',
  //     },
  //     {
  //       url: 'https://ibb.co/4Mv17pm',
  //       alt: '',
  //     },
  //     {
  //       url: 'https://ibb.co/4Mv17pm',
  //       alt: '',
  //     },
  //     {
  //       url: 'https://ibb.co/4Mv17pm',
  //       alt: '',
  //     },
  //     {
  //       url: 'https://ibb.co/4Mv17pm',
  //       alt: '',
  //     },
  //   ],
  // }

  const formData = new FormData()
  formData.append('category', category.value)
  formData.append('title', title.value)
  formData.append('price', price.value)
  formData.append('stock', stock.value)
  formData.append('description', description.value)
  formData.append('size', size.value)
  formData.append('origin', origin.value)
  formData.append('attribute', attribute.value)
  formData.append('main_image', image.files[0])
  for (let i = 1; i < image.files.length; i++) {
    formData.append(`sub_image`, image.files[i])
  }

  // 제품 데이터 전송
  const token = localStorage.getItem('jwt')
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}: ${value}`)
  // }
  fetch(`${API_URL}admin/products`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 실패했습니다.')
      }
      return response.json()
    })
    .then(data => {
      // JWT 만료 처리
      if (data.error === 'jwt expired') {
        localStorage.removeItem('jwt')
        alert('로그인 인증이 만료되었습니다.')
        location.href = '/user/login.html'
        return false
      }
      console.log(data)
      location.reload()
    })
    .catch(error => console.error('Error:', error))

  // UI 업데이트
  e.target.parentNode.parentNode.remove()
  select('.product-add').style.display = ''
}

function handleUpdateProduct(e) {
  // 상품 수정
  // 해당 상품 정보를 기반으로 수정 폼 생성 및 데이터 세팅
  if (!e.target.classList.contains('product-update')) return

  function createElement(type, attributes, ...children) {
    const element = document.createElement(type)
    for (const key in attributes) {
      if (key === 'innerHTML') {
        element.innerHTML = attributes[key]
      } else {
        element.setAttribute(key, attributes[key])
      }
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    })
    return element
  }

  // 선택된 요소를 대체하기 위한 함수 (상품 수정 UI)
  function replaceElement(selector, newElement) {
    const parent = e.target.parentNode.parentNode
    const oldElement = parent.querySelector(selector)
    oldElement.replaceWith(newElement)
  }

  // 요소 변환 처리
  const parent = e.target.parentNode.parentNode
  const infos = [
    {
      selector: '.product-title',
      type: 'input',
      class: 'product-input title1',
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-img',
      type: 'label',
      class: 'img-label',
      innerHTML: '이미지를 다시 첨부해주셔야 수정 가능합니다.(최대6개)',
      child: {
        type: 'input',
        id: 'input-img',
        class: 'product-input image1',
        prop: 'files',
        from: 'files',
        attributes: { type: 'file', accept: 'image/*', multiple: true },
      },
    },
    {
      selector: '.product-price',
      type: 'input',
      class: 'product-input price1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { type: 'number' },
    },
    {
      selector: '.product-stock',
      type: 'input',
      class: 'product-input stock1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { type: 'number' },
    },
    {
      selector: '.product-category',
      type: 'select',
      class: 'product-input category1',
      options: ['Custom', 'MODERN', 'Lovely', 'Deskterior', 'Classic', 'Acc'],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-size',
      type: 'select',
      class: 'product-input size1',
      options: ['Large', 'Medium', 'Small', 'One-Size'],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-origin',
      type: 'select',
      class: 'product-input origin1',
      options: [
        '한국',
        '남아공',
        '네덜란드',
        '베트남',
        '이스라엘',
        '에티오피아',
        '이탈리아',
        '일본',
        '중국',
        '짐바브웨',
        '케냐',
        '콜롬비아',
        '탄자니아',
        '프랑스',
        '호주',
      ],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-description',
      type: 'textarea',
      class: 'product-input description1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { cols: 25, rows: 2 },
    },
    {
      selector: '.product-attribute',
      type: 'textarea',
      class: 'product-input attribute1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { cols: 25, rows: 2 },
    },
  ]

  infos.forEach(info => {
    let newElement
    if (info.type === 'select') {
      newElement = createElement(
        info.type,
        { class: info.class },
        ...info.options.map(option =>
          createElement('option', { innerHTML: option, value: option })
        )
      )
    } else if (info.child) {
      const childElement = createElement(info.child.type, {
        ...info.child.attributes,
        id: info.child.id,
        class: info.child.class,
      })
      newElement = createElement(
        info.type,
        {
          class: info.class,
          htmlFor: info.child.id,
          innerHTML: info.innerHTML,
        },
        childElement
      )
    } else {
      newElement = createElement(info.type, {
        ...info.attributes,
        class: info.class,
      })
    }
    newElement[info.prop] = parent.querySelector(info.selector)[info.from]
    replaceElement(info.selector, newElement)
  })

  // 버튼 변환 처리
  const deleteButton = createElement('button', {
    class: 'btn update-cancel',
    innerHTML: '취소',
  })
  const saveButton = createElement('button', {
    class: 'btn update-save',
    innerHTML: '저장',
  })
  replaceElement('.product-delete', deleteButton)
  replaceElement('.product-update', saveButton)
}

function handleDeleteProduct(e) {
  // 상품 삭제
  // 삭제 확인 후 서버로 DELETE 요청
  if (!e.target.classList.contains('product-delete')) return
  const parent = e.target.parentNode.parentNode
  const id = parent.querySelector('.product-id').innerHTML
  const token = localStorage.getItem('jwt')
  fetch(`${API_URL}admin/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  })
    .then(response => {
      if (response.json().error === 'jwt expired') {
        localStorage.removeItem('jwt')
        alert('로그인 인증이 만료되었습니다.')
        location.href = '/user/login.html'
        return false
      }
      if (response.ok) {
        location.reload()
      } else {
        console.error('상품삭제를 실패하였습니다.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

function handleUpdateCancel(e) {
  // 수정 취소
  // 페이지 새로고침해서 원래 상태로 복구
  location.reload()
}

function handleUpdateSave(e) {
  // 수정 저장
  // 수정된 폼 데이터 수집 및 유효성 검사 후 서버로 PUT 요청
  if (e.target.innerHTML !== '저장') return

  // 생성버튼을 올바르게 눌렀다면 ↓실행
  // 요소 선택을 위한 helper 함수
  function select(selector) {
    return document.querySelector(selector)
  }
  // 필수 입력 필드 선택
  const title = select('.title1')
  const price = select('.price1')
  const stock = select('.stock1')
  const description = select('.description1')
  const attribute = select('.attribute1')
  const category = select('.category1')
  const size = select('.size1')
  const origin = select('.origin1')
  const image = select('.image1')

  // 이미지 파일 추가 (메인 이미지와 서브 이미지를 포함하여 모두 같은 input에서 선택)
  const formData = new FormData()
  formData.append('category', category.value)
  formData.append('title', title.value)
  formData.append('price', price.value)
  formData.append('stock', stock.value)
  formData.append('description', description.value)
  formData.append('size', size.value)
  formData.append('origin', origin.value)
  formData.append('attribute', attribute.value)
  formData.append('main_image', image.files[0])

  for (let i = 1; i < image.files.length; i++) {
    formData.append(`sub_image`, image.files[i])
  }

  const id =
    e.target.parentNode.parentNode.querySelector('.product-id').innerHTML
  const token = localStorage.getItem('jwt')

  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`)
  }
  fetch(`${API_URL}admin/products/${id}`, {
    method: 'PUT',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
    body: formData,
  })
    .then(response => {
      if (response.json().error === 'jwt expired') {
        localStorage.removeItem('jwt')
        alert('로그인 인증이 만료되었습니다.')
        location.href = '/user/login.html'
        return false
      }
      location.reload()
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

//logOut
const logOut_btn = document.querySelector('.logOut-btn')
logOut_btn.addEventListener('click', () => {
  localStorage.removeItem('jwt')
})
