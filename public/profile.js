const saveGroupBttn = document.querySelector("#saveGroupBttn");
const groupNameInput =document.querySelector('#groupNameInput')
const descriptionInput =document.querySelector('#descriptionInput')
const groupListItems =document.querySelectorAll('.groupListItem')

console.log('hi seth')

//created a group and posted it to the DB//

saveGroupBttn.addEventListener('click', () =>{ 
  fetch('group/create', { //
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


// create the navigation to the individual group page //

Array.from(groupListItems).forEach(function(gListItem) {
  console.log(gListItem.dataset)// you do dataset to get the id
  gListItem.addEventListener('click', function(){
    window.location = `groups/${gListItem.dataset.id}` //takes you to a new browser page instead of fetching. 
  });
});
  
  