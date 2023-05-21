const moment = require('moment'); // require

const generateReminderDates = (startDate, frequency) => {

    const reminders = []
    // Assuming you have a date stored in a variable
    const date = moment(startDate);
    reminders.push({newDate:date.format('MMMM DD, YYYY'), sent:false})
    switch (frequency.toLowerCase()) {
        case "bi-weekly":
            for (let i = 0; i < 26; i++) {
                const newDate = date.add(2, 'week').format('MMMM DD, YYYY')
                reminders.push({newDate, sent:false});
            }
            return reminders;
        case "monthly":
            for (let i = 0; i < 12; i++) {
                const newDate = date.add(1, 'month').format('MMMM DD, YYYY')
                reminders.push({newDate, sent:false});
            }
            return reminders;
        case "quarterly":
            for (let i = 0; i < 4; i++) {
                const newDate = date.add(3, 'months').format('MMMM DD, YYYY')
                reminders.push({newDate, sent:false});
            }
            return reminders;
        case "semi-monthly":
            for (let i = 0; i < 2; i++) {
                const newDate = date.add(6, 'months').format('MMMM DD, YYYY')
                reminders.push({newDate, sent:false});
            }
            return reminders;
        case "annually":
            for (let i = 0; i < 1; i++) {
                const newDate = date.add(1, 'year').format('MMMM DD, YYYY')
                reminders.push({newDate, sent:false});
            }
            return reminders;
        default:
            return reminders
    }
}

module.exports = {
    generateReminderDates
}