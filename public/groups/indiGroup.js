console.log('connected')
const newContactForm = document.querySelector('#newContactForm')
const individualModal = new bootstrap.Modal(document.getElementById('individualModal'))
const addIndiBttn = document.querySelector('#indiBttn')
const updateContactForms = document.querySelectorAll('.contact-form')







// post when creating a new contact form 

addIndiBttn.addEventListener('click', () => {
  individualModal.show()
})



//updating contact ===========

Array.from(updateContactForms).forEach(contact =>{
  console.log(contact)
  contact.addEventListener('submit', (e) =>{ 
  e.preventDefault()
  console.log(e.target.dataset)
  const formData = new FormData()
  formData.append('firstName', document.querySelector('#firstNameInput').value)
  formData.append('lastName', document.querySelector('#lastNameInput').value)
  formData.append('phone', document.querySelector('#phoneInput').value)
  formData.append('email', document.querySelector('#emailInput').value)
  formData.append('message', document.querySelector('#messageInput').value)
  formData.append('frequency', document.querySelector('#timeFrame').value)
  const targetFile = document.querySelector('#imageInput').files?.[0]
  console.log(targetFile)
  if(targetFile){
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
          frequency: formData.get('frequency'),
          img: formData.get('img'),
          fileName: formData.get('fileName'),
          groupId: e.target.dataset.groupId,
          contactId: e.target.dataset.contactId
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
        frequency: formData.get('frequency'),
        img: formData.get('img'),
        fileName: formData.get('fileName'),
        groupId: e.target.dataset.groupId,
        contactId: e.target.dataset.contactId
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


// editBttn.addEventListener('click', (e) => {
//   e.preventDefault()
//   console.log(currentEditId)
//   fetch('groups/update', { 
//     method: 'put',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       groupName: editName.value,
//       description: editDescription.value,
//       id: currentEditId
//     })
//   })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       editModal.hide()
//     })
// });




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


 // for (const value of formData.values()) {
  //   console.log(value);
  // }