// LoginContext.js
import {createContext, useEffect, useState} from 'react'
import Cookies from 'js-cookie';

const LoginContext = createContext();

export const LoginProvider = ({children}) => {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(()=>{
    const sessionCookie = Cookies.get('session');
    // check the session cookie if it exist
    if(sessionCookie !== undefined){
      console.log('session_cookie ' + sessionCookie);
      const { username, isLoggedIn } = JSON.parse(sessionCookie);
      setUsername(username)
      setIsLoggedIn(isLoggedIn);
    }
  }, [])

  const logout = () =>{
    Cookies.remove('session');
    setUsername(null);
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