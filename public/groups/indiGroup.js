console.log('connected')
const newContactForm = document.querySelector('#newContactForm')




// post when creating a new contact form 

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
  console.log(formData)
  fetch('contact/create', { 
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      message: formData.get('message'),
      frequency: formData.get('frequency'),
      id: e.target.dataset.id
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    // window.location.reload(true)
  })
});


 // for (const value of formData.values()) {
  //   console.log(value);
  // }