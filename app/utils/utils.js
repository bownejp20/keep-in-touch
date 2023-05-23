const getReminderFormat = (contacts) => {
return contacts.reduce((calendarEvents, contact) => {
  contact.forEach(person => {
    const {firstName, lastName, phone, frequency:{reminderDates}} = person
    reminderDates.forEach(date => {
      calendarEvents[date.newDate] ? calendarEvents[date.newDate].push({
        Name: `${firstName} ${lastName}`,
        Phone: phone
      }) : calendarEvents[date.newDate] = []; calendarEvents[date.newDate].push({
        Name: `${firstName} ${lastName}`,
        Phone: phone
      })
    })
  })
  return calendarEvents
}, {} )

}



module.exports = {getReminderFormat}