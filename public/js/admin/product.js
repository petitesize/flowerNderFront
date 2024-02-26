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
        <option value="CUSTOM">CUSTOM</option>
        <option value="MORDERN">MORDERN</option>
        <option value="LOVELY">LOVELY</option>
        <option value="DESKTERIOR">DESKTERIOR</option>
        <option value="CLASSIC">CLASSIC</option>
        <option value="DESKTERIOR">DESKTERIOR</option>
        <option value="CLASSIC">CLASSIC</option>
        <option value="ACC">ACC</option>
      </select>
      <input / class="product-input title" type='text' placeholder="제품명 입력">
      <label for="input-img" class="img-label">이미지첨부(5개)</label>
      <input / class="product-input image" id="input-img" type='file' accept='image/*' multiple>
      <input / class="product-input price" type='number' placeholder="가격 입력">
      <input / class="product-input stock" type='number' placeholder="재고 입력">
      <textarea class="product-input description" rows=2 cols=25 maxlength=50 placeholder="제품 상세 설명 입력"></textarea>
      <select class="product-input size">
        <option value="Large">Large</option>
        <option value="Medium">Medium</option>
        <option value="Small">Small</option>
      </select>
      <select class="product-input origin">
        <option value="Korea">Korea</option>
        <option value="Japan">Japan</option>
        <option value="China">China</option>
        <option value="America">America</option>
      </select>
      <textarea class="product-input attribute" rows=2 cols=25 maxlength=50 placeholder="제품 특징 입력"></textarea>
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
  const files = select('.image').files
  const category = select('.category')
  const size = select('.size')
  const origin = select('.origin')

  // 제품 생성할 때 input 올바르게 작성했는지 검사
  if (
    !title.value ||
    !title.value.trim() ||
    !price.value ||
    !price.value.trim() ||
    files.length !== 5 ||
    !stock.value ||
    !stock.value.trim() ||
    !description ||
    !description.value.trim() ||
    !attribute.value ||
    !attribute.value.trim()
  ) {
    alert('빈칸을 전부 작성하셔야 생성 가능합니다.(이미지 5개)')
    return
  }

  // 데이터 객체 생성
  const datas = {
    category: category.value,
    title: title.value,
    price: price.value,
    stock: stock.value,
    size: size.value,
    origin: origin.value,
    description: description.value,
    attribute: attribute.value,
    main_image: 'img url',
    sub_image1: 'img url',
    sub_image2: 'img url',
    sub_image3: 'img url',
    sub_image4: 'img url',
    sub_image5: 'img url',
  }

  // 제품 데이터 전송
  fetch('/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datas),
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
      }
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
      innerHTML: '이미지첨부 (5개)',
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
      options: ['CUSTOM', 'MODERN', 'LOVELY', 'DESKTERIOR', 'CLASSIC', 'ACC'],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-size',
      type: 'select',
      class: 'product-input size1',
      options: ['Large', 'Medium', 'Small'],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-origin',
      type: 'select',
      class: 'product-input origin1',
      options: ['Korea', 'Japan', 'China', 'America'],
      prop: 'value',
      from: 'innerHTML',
    },
    {
      selector: '.product-description',
      type: 'textarea',
      class: 'product-input description1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { cols: 25, rows: 2, maxLength: 50 },
    },
    {
      selector: '.product-attribute',
      type: 'textarea',
      class: 'product-input attribute1',
      prop: 'value',
      from: 'innerHTML',
      attributes: { cols: 25, rows: 2, maxLength: 50 },
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
  fetch(`/admin/products/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
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
  console.log(1)
  const datas = {
    category: document.querySelector('.category1').value,
    title: document.querySelector('.title1').value,
    price: document.querySelector('.price1').value,
    stock: document.querySelector('.stock1').value,
    size: document.querySelector('.size1').value,
    origin: document.querySelector('.origin1').value,
    description: document.querySelector('.description1').value,
    attribute: document.querySelector('.attribute1').value,
    main_image: 'img url',
    sub_image1: 'img url',
    sub_image2: 'img url',
    sub_image3: 'img url',
    sub_image4: 'img url',
    sub_image5: 'img url',
  }
  const id =
    e.target.parentNode.parentNode.querySelector('.product-id').innerHTML
  fetch(`/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datas),
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
