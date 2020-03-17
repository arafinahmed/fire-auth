import React, { useState } from 'react';

import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';


firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn : false, 
    userName : '',
    email: '',
    photo: '',
    password: '', 
    isValidEmail: false
    
    
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
      firebase.auth().signInWithPopup(provider)
      .then(res => {
        const {displayName, photoURL, email} = res.user;
        const signedInUser = {
          isSignedIn : true,
          userName : displayName,
          email : email,
          photo : photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
        const signOutUser = {
          isSignedIn : false, 
          userName : '',
          email: '',
          photo: '',
          error: '',
          existingUser: false
          
          
        }
        setUser(signOutUser);
    })
    .catch(err => {

    })
  }

  var is_valid_email = email => { return /^.+@.+\..+$/.test(email);}
  const switchForm = event => {
        const updateNewUser = {...user};
        updateNewUser.existingUser = event.target.checked;
        setUser(updateNewUser);
        console.log(event.target.checked);
  }

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };
    
    let isValidEmail = true;

    if(event.target.name ==='email'){
      isValidEmail= is_valid_email(event.target.value);
      console.log(isValidEmail);
    }
    if(event.target.name === 'password'){
      isValidEmail = event.target.value.length > 8;
      console.log(isValidEmail);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo["isValidEmail"] = isValidEmail;
    
    setUser(newUserInfo);
    
  }
  const createAccount = (event) => {
    if(user.isValidEmail){
      console.log(user);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const updateNewUser = {...user};
        updateNewUser.isSignedIn = true;
        updateNewUser.error = '';
        setUser(updateNewUser);

      })
      .catch(err => {
        console.log(err.message);
        const updateNewUser = {...user};
        updateNewUser.isSignedIn = false;
        updateNewUser.error = err.message;
        setUser(updateNewUser);
      })
    }
    
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = (event) => {
    if(user.isValidEmail){
      console.log(user);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const updateNewUser = {...user};
        updateNewUser.isSignedIn = true;
        updateNewUser.error = '';
        setUser(updateNewUser);

      })
      .catch(err => {
        console.log(err.message);
        const updateNewUser = {...user};
        updateNewUser.isSignedIn = false;
        updateNewUser.error = err.message;
        setUser(updateNewUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome , {user.userName}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <br/>
      <input type="checkbox" name="switchForm" onChange={switchForm}/>
      <label htmlFor="switchForm"> Rwturning user    
      </label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      
      <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
      <br/>
      <input type="submit" value="Sign In"/>
      </form>



      <h2>Our own Authentication</h2>
      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input type="text" onBlur={handleChange} name="userName" placeholder="Your Name" required/>
      <br/>
      <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
      <br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p> {user.error}</p>
      }
      
    </div>
  );
}

export default App;
