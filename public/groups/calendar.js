let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
const groupModal = new bootstrap.Modal(document.getElementById('groupModal'))
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const listOfContacts = document.querySelector('.contactModal')


// MODAL THAT SHOWS THE LIST OF CONTACTS EACH DAY ====================================

function openModal(date, contacts) {
  console.log(contacts)
  if (contacts) {
    listOfContacts.replaceChildren()
    contacts.forEach(contact => {
      const li = document.createElement('li')
      li.innerText = `${contact.Name}: ${contact.Phone}`;
      listOfContacts.appendChild(li)
      groupModal.show()
    })
  }
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

// SQUARES IN CALENDAR ARE CREATED ====================

async function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  console.log(day, month, year)
  console.log(new Date('May 23, 2023'))

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const response = await fetch('/calendar/reminder', { //
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await response.json()
  const monthEvents = {}
  console.log(data)
  for (let date in data.contacts) {
    console.log(date)
    const eventDate = new Date(date)
    eventMonth = eventDate.getMonth()
    eventYear = eventDate.getFullYear()
    eventDay = eventDate.getDate()
    console.log(eventDay)
    console.log(eventDate)
    
    if (eventMonth === month && eventYear === year) {
      monthEvents[(eventDay).toString()] = data.contacts[date]
    }
  }
  // console.log(monthEvents, data)
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('li');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    // console.log('day format', dateString)



    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      // creating the events for the calendar===============================

      // console.log(monthEvents[i-paddingDays], i-paddingDays, i)
      if (monthEvents[i - paddingDays]) {
        monthEvents[i - paddingDays].forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = `${event.Name}: 
                                ${event.Phone}`;
          daySquare.appendChild(eventDiv);
        })
      }

      daySquare.addEventListener('click', () => openModal(dayString, monthEvents[i - paddingDays]));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}

//closes the modal when checking people

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  listOfContacts.replaceChildren()

}



// function saveEvent() {
//   if (eventTitleInput.value) {
//     eventTitleInput.classList.remove('error');

//     events.push({
//       date: clicked,
//       title: eventTitleInput.value,
//     });

//     localStorage.setItem('events', JSON.stringify(events));
//     closeModal();
//   } else {
//     eventTitleInput.classList.add('error');
//   }
// }

// function deleteEvent() {
//   events = events.filter(e => e.date !== clicked);
//   localStorage.setItem('events', JSON.stringify(events));
//   closeModal();
// }

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  // document.getElementById('saveButton').addEventListener('click', saveEvent);
  // document.getElementById('cancelButton').addEventListener('click', closeModal);
  // // document.getElementById('deleteButton').addEventListener('click', deleteEvent);
//   document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();