// LoginContext.js
import {createContext, useEffect, useState} from 'react'
import Cookies from 'js-cookie';

const LoginContext = createContext();

export const LoginProvider = ({children}) => {
  const [username, setUnsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(()=>{
    const session_cookie = Cookies.get('session');
    // check the session cookie if it exist
    // new Promise((resolve, reject)=>{{}))
    if(session_cookie !== undefined){
      console.log('session_cookie ' + session_cookie);
      const username = JSON.parse(session_cookie).username;
      const isLoggedIn = JSON.parse(session_cookie).isLoggedIn;
      console.log(username)
      setUnsername(username)
      setIsLoggedIn(isLoggedIn);
    }
  }, [])

  const logout = () =>{
    Cookies.remove('session');
    setUnsername(null);
    setIsLoggedIn(false);
  }

  


  return (
    <>
      <LoginContext.Provider value={{ username, isLoggedIn, logout}}>
        {children}
      </LoginContext.Provider>
    </>
  );
};

export default LoginContext;