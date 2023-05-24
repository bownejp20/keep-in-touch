const cloudinary = require("../config/cloudinary");
const {generateReminderDates} = require("./utils/date");
const moment = require('moment');
const {Reminder} = require("../config/services/twilio");
const {getReminderFormat} = require("./utils/utils")
module.exports = function (app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage') });
  })

  //  Sending reminders out ==================================

  const sendReminders = (user) => {
    console.log('user', user)
    db.collection('groups').aggregate([
      {
        $match: {
          'user': ObjectId(user._id)
        }
      },
      {
        $unwind: "$contacts"
      },
      {
        $match: {
          'contacts.frequency.reminderDates': {
            $elemMatch: {
              'newDate': moment().format('MMMM DD, YYYY'),
              'sent': false
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          contacts: { $push: "$contacts" }
        }
      },
      // {
      //   $match: {
      //     'contacts.frequency.reminderDates': {
      //       $elemMatch: {
      //         'sent': false
      //       }
      //     }
      //   }
      // }
    ]).toArray((err, result) => {
      if (err) return console.log(err);
      const contacts = result.length > 0 ? result[0].contacts : [];
      const smsFormat = contacts.map(({firstName, lastName, phone, message, _id, frequency: {reminderDates}}) => {
        console.log(reminderDates)
        return {firstName, lastName, phone:'+1'+phone, message:`Reminder to call ${firstName} ${lastName}`, _id}
  
      });
      console.log(smsFormat)
      smsFormat.forEach(contact => {    
        console.log(contact.phone)
        new Reminder(process.env.Jessica_Number, contact.message).sendReminder()
      })      

  
      db.collection('groups').updateMany(
        {
          'user': ObjectId(user._id),
          'contacts._id': { $in: smsFormat.map(contact => contact._id) },
          'contacts.frequency.reminderDates.sent': false
        },
          {
            $set: {
              'contacts.$[elem].frequency.reminderDates.$[date].sent': true
            }
          },
          {
            arrayFilters: [
              { 'elem._id': { $in: smsFormat.map(contact => contact._id) } },
              { 'date.newDate': moment().format('MMMM DD, YYYY') }
            ]
          }
      )
    });
  }


  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    console.log(req.user, 'profile route')
    db.collection('groups').find({ user: ObjectId(req.user._id) }).toArray((err, result) => {
      sendReminders(req.user)
      if (err) return console.log(err)
      res.render('profile.ejs', { //groups an use are being thrown into the profile.ejs file which is when we are able to use it there
        user: req.user,
        groups: result,

      })
    })
  });

   // CALENDAR PAGE =========================
   app.get('/calendar',  function (req, res) {
    console.log(req.user)
    db.collection('groups').find({ user: ObjectId(req.user._id) }).toArray((err, result) => {
      sendReminders(req.user)
      if (err) return console.log(err)
      res.render('calendar.ejs', { //groups an use are being thrown into the profile.ejs file which is when we are able to use it there
        user: req?.user?? {
          local: {
            email: 'test@gmail.com',
            password: '$2a$08$8MdcbXUEqhqMnVKx0AH5f.QpUVpHW.uQB9cFmJH4BRHPJKslXlBLK',
            firstName: 'Seth',
            lastName: 'Villa',
            fullName: 'Seth Villa'
          },
          _id: '646488526b05d27fb5818be2',
          __v: 0
        },
        groups: result,

      })
    })
  });

  // Gets all the groups/contacts for CALENDAR ============================

  app.get('/calendar/reminder', function (req, res) {
    db.collection('groups').find({ user: ObjectId(req.user._id) }).toArray((err, groups) => {
      if (err) return console.log(err); 
      //req.use._id goes in objectID above

        const contacts = groups.map(group => group.contacts)

      console.log('contacts', contacts)
      // const contacts = groups.map(group => group.contacts).flat();
      res.send({ 
        // user: req.user,
        contacts: getReminderFormat(contacts),
      });
    });
  });
  

  //takes me to the group indi page ========================
  app.get('/groups/:id', isLoggedIn, function (req, res) {
    console.log(req.params)
    if (!req?.params?.id) {
      res.send('404 your fault!')
      return
    }
    sendReminders(req.user)
    const { id } = req.params // params represent the path name that we destructured 
    db.collection('groups').find({ _id: ObjectId(id) }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('individualGroup.ejs', { user: req.user, groups: result[0] })
    })
  });

  // FOR THE GROUP SEARCH ============================

  app.get('/search/groups', isLoggedIn, function (req, res) {
    console.log(req.params)
    const { groupName } = req.query
    if (!groupName) {
      res.send({ error: 'Enter Group Name!', success: false })
      return
    }
            //we did the regex to find partial matches in the search 

    db.collection('groups').find({ user:ObjectId(req.user.id), groupName: { $regex: groupName, $options: 'i' } }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.send({ groups: result })
    })
  });


   // CONTACT SEARCH ==================

   app.get('/search/contact', isLoggedIn, function (req, res) {
    console.log(req.query)
    const { contactSearch, groupId } = req.query
    console.log(contactSearch, groupId)
    if (!contactSearch) {
      res.send({ error: 'Enter Contact Name!', success: false })
      return
    }
          //we did the regex to find partial matches in the search 
   
    db.collection('groups').aggregate([
      {
        $match: {
          _id: ObjectId(groupId)
        }
      },
      {
        $unwind: "$contacts"
      },
      {
        $match: {
          $or: [
            { 'contacts.firstName': { $regex: contactSearch, $options: 'i' } },
            { 'contacts.lastName': { $regex: contactSearch, $options: 'i' } },
            { 'contacts.phone': { $regex: contactSearch, $options: 'i' } },
            { 'contacts.email': { $regex: contactSearch, $options: 'i' } },
            { 'contacts.frequency.frequency': { $regex: contactSearch, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: "$_id",
          contacts: { $push: "$contacts" }
        }
      }
    ]).toArray((err, result) => {
      if (err) return console.log(err);
      const contacts = result.length > 0 ? result[0].contacts : [];
      console.log(contacts);
      res.send({ contacts });
    });
  });
  

  // posting when we create a group name =======================

  app.post('/group/create',isLoggedIn, (req, res) => {
    const { groupName, description } = req.body
    db.collection('groups').save({ groupName, description, contacts: [], user: req.user._id }, (err, result) => { //contacts:[] = we know we need it in the future so we are creating it now and giving it a default value
      if (err) return console.log(err)
      console.log('saved to database')
      res.send({
        newGroup: result.ops[0]
      })
    })
  })



  // posting when we add an individual contact ============

  app.post('/groups/contact/create', isLoggedIn, async (req, res) => {
    const { firstName, lastName, phone, email, message, frequency, id, fileName, img, startDate, linkedIn, instagram, facebook } = req.body
    console.log(req.body)
    let secure_url = null
    let public_id = null
    try {
      if (img) {
        const result = await cloudinary.uploader.upload(img);
        const { secure_url: url, public_id: publicId } = result
        secure_url = url
        public_id = publicId
        console.log(result);
        console.log(fileName);
      }
      db.collection('groups').findOneAndUpdate({ _id: ObjectId(id) }, { $push: { contacts: { _id: ObjectId(), firstName, lastName, phone, email, message,linkedIn, instagram, facebook, frequency: { frequency, startDate, reminderDates: generateReminderDates(startDate, frequency), }, img: { public_id, fileName, secure_url } } } },
        { returnOriginal: false }, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          console.log(result.value)
          res.send({
            newContact: result.value
          })
        })
    } catch (err) {
      console.log(err)
    }
  })

  // updateing group name and description

  app.put('/groups/update', isLoggedIn, (req, res) => {
    const { groupName, description, id } = req.body
    console.log(req.body)

    db.collection('groups').findOneAndUpdate({ _id: ObjectId(id) }, { $set: { groupName, description } },
      { returnOriginal: false }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result.value)
        res.send({
          editedGroup: result.value
        })
      })
  })

  // updating contacts on indi page ========

  app.put('/groups/contact/update', isLoggedIn, async (req, res) => {
    const { groupId, contactId, firstName, email, lastName, message, frequency, phone, startDate, publicId, img, fileName, linkedIn, instagram, facebook } = req.body
    // console.log(req.body)
    console.log(generateReminderDates(startDate, frequency))
    let secure_url = null
    let public_id = null
    try {
      if (img) {
        console.log('inconditional')
        if(publicId){
          await cloudinary.uploader.destroy(publicId);
        }
        const result = await cloudinary.uploader.upload(img);
        const { secure_url: url, public_id: newPublicId } = result
        secure_url = url
        public_id = newPublicId
        console.log(result)
      //   // console.log(result);
      }
      console.log(public_id, fileName)
      db.collection('groups').updateOne({ _id: ObjectId(groupId), 'contacts._id': ObjectId(contactId) }, {
        $set:
        {
          "contacts.$.firstName": firstName,
          "contacts.$.lastName": lastName,
          "contacts.$.phone": phone,
          "contacts.$.email": email,
          "contacts.$.message": message,
          "contacts.$.frequency.frequency": frequency,
          "contacts.$.frequency.startDate": startDate, 
          "contacts.$.linkedIn": linkedIn,
          "contacts.$.instagram": instagram,
          "contacts.$.facebook": facebook,
          "contacts.$.frequency.reminderDates": generateReminderDates(startDate, frequency), 
          ...(img? { "contacts.$.img": {secure_url, fileName, public_id}} : {})
          
        }
      },
        { returnOriginal: false }, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          console.log(result.value)
          res.send({
            editedGroup: result.value
          })
        })
    }
    catch (error) {

    }
  })


  // deletes groups on profile page ==============

  app.delete('/groups', isLoggedIn, (req, res) => {
    const { id } = req.body
    db.collection('groups').findOneAndDelete({ _id: ObjectId(id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('transaction deleted!')
    })
  })

  // deletes contacts on indi page ==============

  app.delete('/groups/contact/delete', isLoggedIn, (req, res) => {
    const { contactId } = req.body
    console.log(contactId)
    db.collection('groups').update({ 'contacts._id': ObjectId(contactId) }, { $pull: { contacts: { _id: ObjectId(contactId) } } }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('transaction deleted!')
    })
  })

   // LOGOUT ==============================
   app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  // app.get('/login', function (req, res) {
  //   res.render('index.ejs', { message: req.flash('loginMessage') });
  // });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}


// ({
//   $and: [
//       {
//           $or: [
//               {"firstName": /contactSearch/},
//               {"lastName": /contactSearch/}
//           ]
//       },
//       {
//           "_id": ObjectId(groupId)
//       }
//   ]