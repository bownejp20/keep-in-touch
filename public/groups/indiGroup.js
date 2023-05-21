console.log('connected')
const newContactForm = document.querySelector('#newContactForm')
const individualModal = new bootstrap.Modal(document.getElementById('individualModal'))
const addIndiBttn = document.querySelectorAll('#indiBttn')
const updateContactForms = document.querySelectorAll('.contact-form')
const delContactBtn = document.querySelectorAll('.delContactBtn')
const searchContacts = document.querySelector('#searchContacts')
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))


//Search Contacts =========================

searchContacts.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  var formData = new FormData(event.target); // Create FormData object with form data

  // Access form data using FormData methods
  var contactSearch = formData.get('search'); //formData.get('search') is the same as document.queryselector.(), 

  // Do something with the form data
  console.log('contactSearch:', contactSearch);
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
    console.log(response)
    response.contacts.forEach((contact, index) => {
     const li = document.createElement('li')
     li.addEventListener('click', () =>{
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





// post when creating a new contact form 

Array.from(addIndiBttn).forEach(btn => {
  btn.addEventListener('click', () => {
  individualModal.show()
})
})


// create new contact 

newContactForm.addEventListener('submit', (e) =>{ 
  e.preventDefault()
  console.log(e.target.dataset.id)
  const formData = new FormData()
  formData.append('firstName', document.querySelector('#firstNameInput').value)
  formData.append('lastName', document.querySelector('#lastNameInput').value)
  formData.append('phone', document.querySelector('#phoneInput').value)
  formData.append('email', document.querySelector('#emailInput').value)
  formData.append('message', document.querySelector('#messageInput').value)
  formData.append('frequency', document.querySelector('#timeFrame').value)
  formData.append('startDate', document.querySelector('#startDate').value)
  const targetFile = document.querySelector('#imageInput').files?.[0]
  console.log(targetFile)
  if(targetFile){
    const reader = new FileReader();
    reader.readAsDataURL(targetFile);
    reader.onload = fileReaderEvent => {
      console.log(fileReaderEvent, 'file');
      formData.append('img', fileReaderEvent.target.result)
      formData.append('fileName', targetFile.name)
      fetch('/groups/contact/create', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
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
          id: e.target.dataset.id
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
    reader.onerror = () => {
      console.log(reader.error);
    };
  }else{
    fetch('/groups/contact/create', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
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
        id: e.target.dataset.id
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


//updating contact ===========

Array.from(updateContactForms).forEach(contact =>{
  contact.addEventListener('submit', (e) =>{ 
  e.preventDefault()
  const formData = new FormData(e.target)
  // formData.append('firstName', document.querySelector('#firstNameInput').value)
  // formData.append('lastName', document.querySelector('#lastNameInput').value)
  // formData.append('phone', document.querySelector('#phoneInput').value)
  // formData.append('email', document.querySelector('#emailInput').value)
  // formData.append('message', document.querySelector('#messageInput').value)
  // formData.append('frequency', document.querySelector('#timeFrame').value)
  const targetFile = formData.get('upload')
  console.log(formData.get('upload').files)
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }
  if(targetFile.name){
    const reader = new FileReader();
    reader.readAsDataURL(targetFile);
    reader.onload = fileReaderEvent => {
      console.log(fileReaderEvent, 'file');
      formData.append('img', fileReaderEvent.target.result)
      formData.append('fileName', targetFile.name)
      fetch('/groups/contact/update', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
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
          groupId: e.target.dataset.groupid,
          contactId: e.target.dataset.contactid,
          publicId: e.target.dataset.publicid
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
    reader.onerror = () => {
      console.log(reader.error);
    };
  }else{
    fetch('/groups/contact/update', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
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
        groupId: e.target.dataset.groupid,
        contactId: e.target.dataset.contactid,
        publicId: e.target.dataset.publicid
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
})  
});









 // for (const value of formData.values()) {
  //   console.log(value);
  // }

  // DELETE Contact BUTTON

Array.from(delContactBtn).forEach( bttn => {
  bttn.addEventListener('click', (e) => {
    console.log(e.target.dataset)
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
