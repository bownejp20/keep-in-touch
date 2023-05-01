const newContactForm = document.querySelector('#newContactForm')




// post when creating a new contact form 

newContactForm.addEventListener('click', (e) =>{ 
  e.preventDefault()
  const formData = new FormData()
  formData.append('firstName', document.querySelector('input[name = 'first']'))
  fetch('contact/create', { //
    method: 'post',
    headers: {'Content-Type': 'application/json'},
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
    window.location.reload(true)
  })
});