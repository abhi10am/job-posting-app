import axios from 'axios';
import { createContext, useContext, useState } from 'react'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode';

const AuthContext = createContext(null);

const getUserData = (token) => {
  try {
    return jwtDecode(token);
  }
  catch (err) {
    console.log(err);
  }
}

export const AuthProvider = ({ children }) => {
  const token = Cookies.get('token');
  const [authState, setAuthState] = useState({
    token: token,
    user: token ? getUserData(token) : null,
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      setAuthState({ token, user });
      Cookies.set('token', token, { secure: true });

      return {
        status: true,
        redirect: (user.role === 'ADMIN') ? '/admin/jobs' : '/user/jobs',
        message: response.data.status.message
      }
    }
    catch (err) {
      return {
        status: false,
        message: err.response.data.status.message
      }
    }
  }

  const logout = () => {
    setAuthState({ toke: null, user: null });
    Cookies.remove('token');
    return true;
  }

  const isAuthenticated = () => {
    return authState.token && authState.user;
  }

  return <AuthContext.Provider value={{ authState, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext);
}