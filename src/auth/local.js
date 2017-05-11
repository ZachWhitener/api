/**

    Local strategy for authenticating

**/



import { Strategy } from 'passport-local';
import User from '../models/user';// user model;


export default (passport) => {

  console.log("AT WHAT POINT AM I GETTING HERE");

  // Used to serialize the user for the session
   passport.serializeUser(function(user, done){
       done(null, user.id);
   });

   // Used to deserialize the user
   passport.deserializeUser(function(id, done){
       User.findById(id, function(err, user){
           done(err, user);
       });
   });

  passport.use('local-signup', new Strategy({
    // by default, passport uses req.body.username and req.body.password to authenticate
    // override with req.body.email and req.body.password
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, email, password, done) => {

    User.findOne({ 'email': req.body.email }, (err, user) => {
      if (err) {
        return done(null, false, { message: 'Error in signup' });
      }

      if (user) {
        return done(null, false, { message: 'A user already exists with that email'});
      } else {
        // email isn't taken, create user

        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = newUser.generateHash(req.body.password);

        newUser.save((err) => {
          if (err) {
            console.log("Error saving user", err);
          }

          console.log('----------------------------');
          console.log('New user created.');
          console.log('----------------------------');

          return done(null, newUser);
        });



      }
    });

  }));


  passport.use('local-login', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {

    console.log("in here 2");

    // Find a user whose email is the same as the forms email
    // Checking to see if the user trying to login already exists
    User.findOne({ 'email': email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        console.log("NO USER FOUND WITH THAT EMAIL");
        return done(null, false, { message: 'No user found with that email' });
      }

      // user is found but password is wrong
      if (user && !user.isValidPassword(password)) {
        console.log("NO USER FOUND WITH THAT EMAIL AND PASSWORD COMBINATION")
        return done(null, false, { message: 'No user found with that email and password combination' });
      }

      // if we get here, then the login was successful
      console.log('--------------------------');
      console.log('Successful login');
      console.log('--------------------------');

      return done(null, user);
    });

  }));

}
