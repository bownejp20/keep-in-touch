const cloudinary = require("../config/cloudinary");
module.exports = function (app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage') });
  })

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    console.log(req.user)
    db.collection('groups').find({ user: ObjectId(req.user._id) }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', { //groups an use are being thrown into the profile.ejs file which is when we are able to use it there
        user: req.user,
        groups: result,

      })
    })
  });

  //takes me to the group indi page ========================
  app.get('/groups/:id', function (req, res) {
    console.log(req.params)
    if (!req?.params?.id) {
      res.send('404 your fault!')
      return
    }
    const { id } = req.params // params represent the path name that we destructured 
    db.collection('groups').find({ _id: ObjectId(id) }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('individualGroup.ejs', { user: req.user, groups: result[0] })
    })
  });

  // for the search 

  app.get('/search/groups', function (req, res) {
    console.log(req.params)
    const { groupName } = req.query
    if (!groupName) {
      res.send({ error: 'Enter Group Name!', success: false })
      return
    }
    //we did the regex to find partial matches in the search 

    db.collection('groups').find({ groupName: { $regex: groupName, $options: 'i' } }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.send({ groups: result })
    })
  });


   // CONTACT SEARCH ==================

   app.get('/search/contact', function (req, res) {
    console.log(req.query)
    const { contactSearch, groupId } = req.query
    console.log(contactSearch, groupId)
    if (!contactSearch) {
      res.send({ error: 'Enter Contact Name!', success: false })
      return
    }
    //we did the regex to find partial matches in the search 
   
    db.collection('groups').find({
      $or: [
        { 'contacts.firstName':{ $regex: contactSearch, $options: 'i' }  },
        { 'contacts.lastName': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.phone': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.email': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.frequency.frequency': { $regex: contactSearch, $options: 'i' }  },
      ],
      
      _id: ObjectId(groupId),
    },
    {projection:
      {contacts:{$elemMatch:{$or:[
      { 'firstName':{ $regex: contactSearch, $options: 'i' }  },
        { 'lastName': { $regex: contactSearch, $options: 'i' }  },
        { 'phone': { $regex: contactSearch, $options: 'i' }  },
        { 'email': { $regex: contactSearch, $options: 'i' }  },
        { 'frequency.frequency': { $regex: contactSearch, $options: 'i' }  },
    ]}}}}
    // { contacts: { $elemMatch: { firstName: { $regex: contactSearch, $options: 'i' } } } }
    ).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.send({ groups: result })
    })
    db.collection('groups').find({
      $or: [
        { 'contacts.firstName':{ $regex: contactSearch, $options: 'i' }  },
        { 'contacts.lastName': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.phone': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.email': { $regex: contactSearch, $options: 'i' }  },
        { 'contacts.frequency.frequency': { $regex: contactSearch, $options: 'i' }  },
      ],
      
      _id: ObjectId(groupId),
    },
    {projection:
      {contacts:{$elemMatch:{$or:[
      { 'firstName':{ $regex: contactSearch, $options: 'i' }  },
        { 'lastName': { $regex: contactSearch, $options: 'i' }  },
        { 'phone': { $regex: contactSearch, $options: 'i' }  },
        { 'email': { $regex: contactSearch, $options: 'i' }  },
        { 'frequency.frequency': { $regex: contactSearch, $options: 'i' }  },
    ]}}}}
    // { contacts: { $elemMatch: { firstName: { $regex: contactSearch, $options: 'i' } } } }
    ).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.send({ groups: result })
    })
  });
  
   

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // posting when we create a group name =======================

  app.post('/group/create', (req, res) => {
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

  app.post('/groups/contact/create', async (req, res) => {
    const { firstName, lastName, phone, email, message, frequency, id, fileName, img, startDate } = req.body
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
      db.collection('groups').findOneAndUpdate({ _id: ObjectId(id) }, { $push: { contacts: { _id: ObjectId(), firstName, lastName, phone, email, message, frequency: { frequency, startDate, reminderDates: [] }, img: { public_id, fileName, secure_url } } } },
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

  app.put('/groups/update', (req, res) => {
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

  app.put('/groups/contact/update', async (req, res) => {
    const { groupId, contactId, firstName, email, lastName, message, frequency, phone, startDate, publicId, img, fileName } = req.body
    // console.log(req.body)
    let secure_url = null
    let public_id = null
    try {
      if (img) {
        console.log('inconditional')
        await cloudinary.uploader.destroy(publicId);
        const result = await cloudinary.uploader.upload(img);
        const { secure_url: url, public_id: newPublicId } = result
        secure_url = url
        public_id = newPublicId
        console.log(result)
        console.log({...(img? { "contacts.$.img": {secure_url, fileName, public_id}} : {})})
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

  app.delete('/groups', (req, res) => {
    const { id } = req.body
    db.collection('groups').findOneAndDelete({ _id: ObjectId(id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('transaction deleted!')
    })
  })

  // deletes contacts on indi page ==============

  app.delete('/groups/contact/delete', (req, res) => {
    const { contactId } = req.body
    console.log(contactId)
    db.collection('groups').update({ 'contacts._id': ObjectId(contactId) }, { $pull: { contacts: { _id: ObjectId(contactId) } } }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('transaction deleted!')
    })
  })




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