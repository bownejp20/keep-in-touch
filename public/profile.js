const saveGroupBttn = document.querySelector("#saveGroupBttn");
const groupNameInput = document.querySelector('#groupNameInput')
const descriptionInput = document.querySelector('#descriptionInput')
const groupListItems = document.querySelectorAll('.groupListItem')
const addGroupBttn = document.querySelectorAll('#addGroupBttn')
const groupModal = new bootstrap.Modal(document.getElementById('groupModal'))
const newContactForm = document.querySelector('#newContactForm')
const individualModal = new bootstrap.Modal(document.getElementById('indiModal'))
const addIndiBttn = document.querySelectorAll('.profIndiBttn')
const deleteGroupBttns = document.querySelectorAll('.deleteGroup')
const renameGroupBttns = document.querySelectorAll('.renameGroup')
const searchGroups = document.querySelector('#searchGroups')
const editModal = new bootstrap.Modal(document.getElementById('editModal'))
let currentEditId = ''
let currentAddContactId = ''
const editBttn = document.querySelector('#editBttn')
const editName = document.querySelector('#editNameInput')
const editDescription = document.querySelector('#editDescriptionInput')
const saveIndiBttnProfile = document.querySelector('#saveIndiBttnProfile')
const closeSearch = document.querySelector('.search_closer')


console.log('hi seth', saveGroupBttn)

// CREATED A GROUP AND POSTED IT TO THE DB =============================

Array.from(addGroupBttn).forEach(btn => {
  btn.addEventListener('click', () => {
    groupModal.show()
    console.log('modal opened')
  })
})


saveGroupBttn.addEventListener('click', (e) => {
  e.preventDefault()
  fetch('/group/create', { //
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupName: groupNameInput.value,
      description: descriptionInput.value
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      groupModal.hide()
      location.reload()
    })
});

// RENAME GROUP ===============================

Array.from(renameGroupBttns).forEach(btn => {
  btn.addEventListener('click', (e) => {
    console.log(e.target)
    currentEditId = e.target.dataset.id
    editModal.show()
    console.log('modal opened')
  })
})

editBttn.addEventListener('click', (e) => {
  e.preventDefault()
  console.log(currentEditId)
  fetch('groups/update', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupName: editName.value,
      description: editDescription.value,
      id: currentEditId
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      editModal.hide()
      location.reload()
    })
});


// SEARCH BUTTON ====================================


searchGroups.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  var formData = new FormData(event.target); // Create FormData object with form data

  // Access form data using FormData methods
  var groupSearch = formData.get('search'); //formData.get('search') is the same as document.queryselector.(), 

  // Do something with the form data
  console.log('groupSearch:', groupSearch);
  const ul = document.querySelector('#searchList')
  ul.replaceChildren()
  fetch(`/search/groups?groupName=${groupSearch}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json())
    .then((response) => {
      console.log(response)
      response.groups.forEach((group, index) => {
        const li = document.createElement('li')
        const div = document.createElement('div')
        div.classList.add('category__item')
        const anchor = document.createElement('a')
        anchor.href = `/groups/${group._id}`
        anchor.classList.add('full_link')
        const span = document.createElement('span')
        span.classList.add('cat_title')
        const spanChildOne = document.createElement('span')
        spanChildOne.innerText = `${group.groupName} - ${group.description}`
        spanChildOne.classList.add('name')
        //  const spanChildTwo = document.createElement('span')//only have this for the yellow circle
        //  spanChildTwo.classList.add('count')
        ul.appendChild(li)
        li.appendChild(div)
        div.appendChild(anchor)
        div.appendChild(span)
        span.appendChild(spanChildOne)
        //  span.appendChild(spanChildTwo)
      })
    })
});

// FIX SEARCH BUTTON ==========================

closeSearch.addEventListener('click', (e) => {
  const ul = document.querySelector('#searchList')
  ul.replaceChildren()
})


// DELETE BUTTON ===========================

Array.from(deleteGroupBttns).forEach(bttn => {
  bttn.addEventListener('click', (e) => {
    console.log(e.target.dataset.id)
    fetch('groups', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: e.target.dataset.id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});


// CREATE NAV TO THE INDI GROUP PAGE //

// Array.from(groupListItems).forEach(function (gListItem) {
//   console.log(gListItem.dataset)// you do dataset to get the id
//   gListItem.addEventListener('click', function () {
//     window.location = `groups/${gListItem.dataset.id}` //takes you to a new browser page instead of fetching. 
//   });
// });


// POST WHEN CREATING A NEW CONTACT FORM ==========================

Array.from(addIndiBttn).forEach(bttn => {
  bttn.addEventListener('click', (e) => {
    currentAddContactId = e.target.dataset.id
    individualModal.show()
  })
})



// ADDING AN INDI CONTACT TO A GROUP =====================

newContactForm.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log(currentAddContactId, 'contact ID')
  const formData = new FormData()
  formData.append('firstName', document.querySelector('#firstNameInput').value)
  formData.append('lastName', document.querySelector('#lastNameInput').value)
  formData.append('phone', document.querySelector('#phoneInput').value)
  formData.append('email', document.querySelector('#emailInput').value)
  formData.append('message', document.querySelector('#messageInput').value)
  formData.append('frequency', document.querySelector('#timeFrame').value)
  formData.append('startDate', document.querySelector('#startDate').value)
  formData.append('linkedIn', document.querySelector('#linkedIn').value)
  formData.append('instagram', document.querySelector('#instagram').value)
  formData.append('facebook', document.querySelector('#facebook').value)
  const targetFile = document.querySelector('#imageInput').files?.[0]
  console.log(targetFile)
  if (targetFile) {
    const reader = new FileReader();
    reader.readAsDataURL(targetFile);
    reader.onload = fileReaderEvent => {
      console.log(fileReaderEvent, 'file');
      formData.append('img', fileReaderEvent.target.result)
      formData.append('fileName', targetFile.name)
      fetch('groups/contact/create', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          message: formData.get('message'),
          frequency: formData.get('frequency'),
          img: formData.get('img'),
          fileName: formData.get('fileName'),
          linkedIn: formData.get('linkedIn'),
          instagram: formData.get('instagram'),
          facebook: formData.get('facebook'),
          id: currentAddContactId

        })
      })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          currentAddContactId = ''
          individualModal.hide()
        })
    };
    reader.onerror = () => {
      console.log(reader.error);
    };
  } else {
    fetch('/groups/contact/create', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
        startDate: formData.get('startDate'),
        frequency: formData.get('frequency'),
        img: formData.get('img'),
        fileName: formData.get('fileName'),
        linkedIn: formData.get('linkedIn'),
        instagram: formData.get('instagram'),
        facebook: formData.get('facebook'),
        id: currentAddContactId
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        individualModal.hide()
      })
  };
});



