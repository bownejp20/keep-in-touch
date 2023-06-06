
const newContactForm = document.querySelector('#newContactForm')
const individualModal = new bootstrap.Modal(document.getElementById('individualModal'))
const addIndiBttn = document.querySelectorAll('#indiBttn')
const updateContactForms = document.querySelectorAll('.contact-form')
const delContactBtn = document.querySelectorAll('.delContactBtn')
const searchContacts = document.querySelector('#searchContacts')
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
const closeSearch = document.querySelector('.search_closer')


//SEARCH CONTACTS =========================

searchContacts.addEventListener('submit', function (event) {
  event.preventDefault(); 

  var formData = new FormData(event.target); // Create FormData object with form data

  // Access form data using FormData methods
  var contactSearch = formData.get('search'); //formData.get('search') is the same as document.queryselector.(), 

  // Do something with the form data
  const ul = document.querySelector('#searchList')
  ul.replaceChildren()
  fetch(`/search/contact?groupId=${event.target.dataset.id}&contactSearch=${contactSearch}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json())
    .then((response) => {
      response.contacts.forEach((contact, index) => {
        const li = document.createElement('li')
        li.addEventListener('click', () => {
          document.querySelector('body').classList.remove('search-active')
          location.href = "#";
          location.href = `#${contact._id}`;
          ul.replaceChildren()
        })
        const div = document.createElement('div')
        div.classList.add('category__item')
        const anchor = document.createElement('a')
        //  anchor.href = `/groups/${group._id}`
        //  anchor.classList.add('full_link')
        const span = document.createElement('span')
        span.classList.add('cat_title')
        const spanChildOne = document.createElement('span')
        spanChildOne.innerText = `${contact.firstName} - ${contact.lastName}`
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

// FIX SEARCH BUTTON ====================================

closeSearch.addEventListener('click', (e) => {
  const ul = document.querySelector('#searchList')
  ul.replaceChildren()
})


// POST WHEN CREATING A NEW CONTACT FORM ==================

Array.from(addIndiBttn).forEach(btn => {
  btn.addEventListener('click', () => {
    individualModal.show()
  })
})


// CREATE NEW CONTACT ========================= 

newContactForm.addEventListener('submit', (e) => {
  e.preventDefault()
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
  if (targetFile) {
    const reader = new FileReader();
    reader.readAsDataURL(targetFile);
    reader.onload = fileReaderEvent => {
      formData.append('img', fileReaderEvent.target.result)
      formData.append('fileName', targetFile.name)
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

          id: e.target.dataset.id
        })
      })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          individualModal.hide()
          location.reload()
        })
    };
    reader.onerror = () => {
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
        id: e.target.dataset.id
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        individualModal.hide()
        location.reload()
      })
  };
});


// UPDATING CONTACT ==================

Array.from(updateContactForms).forEach(contact => {
  contact.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const targetFile = formData.get('upload')
    for (const pair of formData.entries()) {
    }
    if (targetFile.name) {
      const reader = new FileReader();
      reader.readAsDataURL(targetFile);
      reader.onload = fileReaderEvent => {
        formData.append('img', fileReaderEvent.target.result)
        formData.append('fileName', targetFile.name)
        fetch('/groups/contact/update', {
          method: 'put',
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
            groupId: e.target.dataset.groupid,
            contactId: e.target.dataset.contactid,
            publicId: e.target.dataset.publicid
          })
        })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            individualModal.hide()
            location.reload()
          })
      };
      reader.onerror = () => {
      };
    } else {
      fetch('/groups/contact/update', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          message: formData.get('message'),
          startDate: formData.get('startDate'),
          frequency: formData.get('frequency'),
          // img: formData.get('img'),
          // fileName: formData.get('fileName'),
          linkedIn: formData.get('linkedIn'),
          instagram: formData.get('instagram'),
          facebook: formData.get('facebook'),
          groupId: e.target.dataset.groupid,
          contactId: e.target.dataset.contactid,
          publicId: e.target.dataset.publicid
        })
      })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          individualModal.hide()
          location.reload()
        })
    };
  })
});


// DELETE CONTACT BUTTON =================================

Array.from(delContactBtn).forEach(bttn => {
  bttn.addEventListener('click', (e) => {
    fetch('/groups/contact/delete', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId: e.target.dataset.contactid
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
