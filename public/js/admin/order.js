// 관리자 컨테이너에서 발생하는 클릭 이벤트 처리
const $adminContainer = document.querySelector('.admin-container')
$adminContainer.addEventListener('click', e => {
  if (e.target.className.includes('order-update')) {
    handleUpdateOrder(e)
  } else if (e.target.className.includes('order-delete')) {
    handleDeleteOrder(e)
  } else if (e.target.className.includes('update-cancel')) {
    handleOrderCancel(e)
  } else if (e.target.className.includes('update-save')) {
    handleOrderSave(e)
  }
})

function handleUpdateOrder(e) {
  // 주문 수정 모드 진입
  // 기존 주문 정보를 기반으로 수정 폼 생성 및 데이터 세팅
  if (!e.target.innerHTML === '주문수정') return
  console.log(1)
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

  // 선택된 요소를 대체하기 위한 함수
  function replaceElement(selector, newElement) {
    const parent = e.target.parentNode.parentNode
    const oldElement = parent.querySelector(selector)
    oldElement.replaceWith(newElement)
  }

  // 요소 변환 처리
  const parent = e.target.parentNode.parentNode
  const infos = [
    {
      selector: '.order-status',
      type: 'select',
      class: 'product-input order-status1',
      options: [
        '입금확인중',
        '입금완료',
        '배송준비중',
        '배송중',
        '배송지연',
        '배송완료',
        '주문처리완료',
      ],
      prop: 'value',
      from: 'innerHTML',
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
  replaceElement('.order-delete', deleteButton)
  replaceElement('.order-update', saveButton)
}

function handleDeleteOrder(e) {
  // 상품 삭제 처리 로직을 여기에 구현
  // 삭제 확인 후 서버로 DELETE 요청
  if (!e.target.classList.contains('order-delete')) return
  const parent = e.target.parentNode.parentNode
  const id = parent.querySelector('.order-id').innerHTML
  fetch(`/admin/orders/${id}`, {
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

function handleOrderCancel(e) {
  // 수정 취소 로직을 여기에 구현
  // 페이지 새로고침 또는 원래 상태로 복구
  location.reload()
}

function handleOrderSave(e) {
  // 수정 저장 로직을 여기에 구현
  // 수정된 폼 데이터 수집 및 유효성 검사 후 서버로 PUT 요청
  if (e.target.innerHTML !== '저장') return
  const datas = {
    order_status: document.querySelector('.order-status1').value,
  }
  const id = e.target.parentNode.parentNode.querySelector('.order-id').orderId
  fetch(`/admin/orders/${id}`, {
    method: 'PATCH',
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
