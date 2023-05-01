module.exports = function (app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('groups').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', { //groups an use are being thrown into the profile.ejs file which is when we are able to use it there
        user: req.user,
        groups: result
      })
    })
  });

  //takes me to the group indi page//
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
    db.collection('groups').save({ groupName, description, contacts: [] }, (err, result) => { //contacts:[] = we know we need it in the future so we are creating it now and giving it a default value
      if (err) return console.log(err)
      console.log('saved to database')
      res.send({
        newGroup: result.ops[0]
      })
    })
  })

  // posting when we add an individual contact ============

  app.post('/groups/contact/create', (req, res) => {
    const { firstName, lastName, phone, email, message, frequency, id } = req.body
    console.log(req.body)

    db.collection('groups').findOneAndUpdate({ _id: ObjectId(id) }, { $push: { contacts: { firstName, lastName, phone, email, message, frequency } } },
      { returnOriginal: false }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result.value)
        res.send({
          newContact: result.value
        })
      })
  })



  app.put('/messages', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $inc: {
          thumbUp: 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/messages/thumbDown', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $inc: {
          thumbDown: - 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true  //might be a bug later on that leon leaves and you need to fix
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
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
