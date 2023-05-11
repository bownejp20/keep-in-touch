const saveGroupBttn = document.querySelector("#saveGroupBttn");
const groupNameInput = document.querySelector('#groupNameInput')
const descriptionInput = document.querySelector('#descriptionInput')
const groupListItems = document.querySelectorAll('.groupListItem')
const addGroupBttn = document.querySelectorAll('#addGroupBttn')
const groupModal = new bootstrap.Modal(document.getElementById('groupModal'))
const newContactForm = document.querySelector('#newContactForm')
const individualModal = new bootstrap.Modal(document.getElementById('indiModal'))
const addIndiBttn = document.querySelector('#indiBttn')

console.log('hi seth', saveGroupBttn)

//created a group and posted it to the DB//

Array.from(addGroupBttn).forEach(btn => {
  btn.addEventListener('click', () => {
    groupModal.show()
    console.log('modal opened')
  })
})


saveGroupBttn.addEventListener('click', (e) => {
  e.preventDefault()
  fetch('group/create', { //
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
    })
});


// create the navigation to the individual group page //

// Array.from(groupListItems).forEach(function (gListItem) {
//   console.log(gListItem.dataset)// you do dataset to get the id
//   gListItem.addEventListener('click', function () {
//     window.location = `groups/${gListItem.dataset.id}` //takes you to a new browser page instead of fetching. 
//   });
// });


// post when creating a new contact form 

// Array.from(addIndiBttn).forEach(bttn => {
//   bttn.addEventListener('click', () => {
//     console.log('hello')
//     individualModal.show()
//   })
// })


// newContactForm.addEventListener('submit', (e) =>{ 
//   e.preventDefault()
//   console.log(e.target.dataset.id)
//   const formData = new FormData()
//   formData.append('firstName', document.querySelector('#firstNameInput').value)
//   formData.append('lastName', document.querySelector('#lastNameInput').value)
//   formData.append('phone', document.querySelector('#phoneInput').value)
//   formData.append('email', document.querySelector('#emailInput').value)
//   formData.append('message', document.querySelector('#messageInput').value)
//   formData.append('frequency', document.querySelector('#timeFrame').value)
//   console.log(formData)
//   fetch('contact/create', { 
//     method: 'post',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       firstName: formData.get('firstName'),
//       lastName: formData.get('lastName'),
//       phone: formData.get('phone'),
//       email: formData.get('email'),
//       message: formData.get('message'),
//       frequency: formData.get('frequency'),
//       id: e.target.dataset.id
//     })
//   })
//   .then(response => {
//     if (response.ok) return response.json()
//   })
//   .then(data => {
//     console.log(data)
//     individualModal.hide()
//   })
// });



