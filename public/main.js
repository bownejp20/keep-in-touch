const addGroupBttn = document.getElementsByClassName("saveGroup");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

Array.from(addGroupBttn).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name,
            msg,
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
});


Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages/thumbDown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name,
        msg,
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
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
