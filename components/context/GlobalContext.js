import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const GlobalState = createContext();

export const useGlobalState = () => {
  return useContext(GlobalState);
};

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgProfile , setImgProfile] = useState(null);
  const [productFav, setProductFav] = useState([]);
  const [email, setEmail] = useState('')
  const existingArray = Cookies.get('compare');
  const cookieArray = existingArray ? JSON.parse(existingArray) : [];
  const [compareCount, setCompareCount] = useState(cookieArray.length);

  const updateCompareCount = (newCount) => {
    setCompareCount(newCount);
  };

  const updateCompareCookie = (newArray) => {
    setCompareCount(newArray.length);  
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const updateImgProfile = (newimgProfile) =>{
    setImgProfile(newimgProfile)
  }

  const updateLogin = (isLogin) => {
    setIsLoggedIn(isLogin);
  };
  const updatecookie = () =>{
    return cookieArray
  }
  const updateProductFav = (favorites) => setProductFav(favorites);



  useEffect(() => {
    // Check if there's a token in localStorage to determine login status
    const token = localStorage.getItem("token");
    const imgprofile = localStorage.getItem("image");
    
    
    if (token) {
      setIsLoggedIn(true);
      const storedUserName = localStorage.getItem("user");
      if (storedUserName) {
        setUser(storedUserName);
      }
    }
    if (imgprofile) {
      setImgProfile(imgprofile);
    }

    try {
      const storedFavorites = localStorage.getItem('productFav');
      if (storedFavorites) {
        setProductFav(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }


  }, []);
  useEffect(() => {
    const fetchFavorites = async () => {
      const email = localStorage.getItem('email'); // Retrieve the email from localStorage or elsewhere
  
      if (email) {
        try {
          const response = await axios.get('/api/favorites', {
            headers: {
              'Content-Type': 'application/json',
            },
            data: { email }, // Send email in the request body
          });
  
          if (response.data) {
            setProductFav(response.data);
            localStorage.setItem('productFav', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };
  
    fetchFavorites();
  }, []); // Fetch on component mount
  
  



  return (
    <GlobalState.Provider value={{
      compareCount, 
      updateCompareCount,
      updateCompareCookie,  
      user,
      email,
      isLoggedIn,
      imgProfile,
      productFav,
      updateUser, 
      updateLogin,
      updatecookie,
      updateImgProfile,
      updateProductFav
    }}>
      {children}
    </GlobalState.Provider>
  );
};
