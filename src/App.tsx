import './App.css';
import React, { useState, useEffect } from 'react';

import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';

import { Amplify } from "@aws-amplify/core";
import {API, Auth} from 'aws-amplify';
//import Auth from '@aws-amplify/auth'
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const NOTSIGNIN = 'You are NOT logged in';
const SIGNEDIN = 'You have logged in successfully';
const SIGNEDOUT = 'You have logged out successfully';
const WAITINGFOROTP = 'Enter OTP number';
const VERIFYNUMBER = 'Verifying number (Country code +XX needed)';
const AUTHORIZATION = 'Authorized User'
function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [otp, setOtp] = useState('');
  const [number, setNumber] = useState('');
  const password = Math.random().toString(10) + 'Abc#';
  useEffect(() => {
    verifyAuth();
  }, []);
  const verifyAuth = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage(NOTSIGNIN);
      });
  };
  const signOut = () => {
    if (user) {
      Auth.signOut();
      setUser(null);
      setOtp('');
      setMessage(SIGNEDOUT);
    } else {
      setMessage(NOTSIGNIN);
    }
  };
  const signIn = () => {
    setMessage(VERIFYNUMBER);
    Auth.signIn(number)
      .then((result) => {
        setSession(result);
        setMessage(WAITINGFOROTP);
      })
      .catch((e) => {
        if (e.code === 'UserNotFoundException') {
          signUp();
        } else if (e.code === 'UsernameExistsException') {
          setMessage(WAITINGFOROTP);
          signIn();
        } else {
          console.log(e.code);
          console.error(e);
        }
      });
  };
  const signUp = async () => {
    const result = await Auth.signUp({
      username: number,
      password,
      attributes: {
        phone_number: number,
      },
    }).then(() => signIn());
    return result;
  };
  const verifyOtp = () => {
    Auth.sendCustomChallengeAnswer(session, otp)
      .then((user) => {
        setUser(user);
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        setMessage(err.message);
        setOtp('');
        console.log(err);
      });
  };
  async function callApi() {
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    console.log("token: ", token)
    setMessage(AUTHORIZATION);

    const requestData = {
        headers: {
            Authorization: token
        }
    }
    const data = await API.get('apiauthapi', '/users', requestData)
    console.log("data: ", data)
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <p>{message}</p>
        {!user && !session && (
          <div>
            <InputGroup className='mb-3'>
              <FormControl
                placeholder='Phone Number (+XX)'
                onChange={(event) => setNumber(event.target.value)}
              />
            </InputGroup>
            <Button variant='outline-secondary'
                     onClick={signIn}>
                  Get OTP
            </Button>
          </div>
        )}
        {!user && session && (
          <div>
            <InputGroup className='mb-3'>
              <FormControl
                placeholder='Your OTP'
                onChange={(event) => setOtp(event.target.value)}
                value={otp}
              />
            </InputGroup>
            <Button variant='outline-secondary'
                     onClick={verifyOtp}>
                  Confirm
                </Button>
          </div>
        )}

        { user && ( 
        <div>
          <ButtonGroup>
            <Button onClick={callApi}>
              Call API
            </Button>
            <Button onClick={signOut}>
              Sign Out
            </Button>
          </ButtonGroup>
        </div>
        )}

      </header>
    </div>
  );
}
export default App;
