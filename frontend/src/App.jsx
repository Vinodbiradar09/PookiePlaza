import { useState , useEffect} from 'react'

import './App.css'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OnBoarding from './pages/OnBoarding'
import NoNotificationFound from './components/NoNotificationFound'
import HomePage from './pages/HomePage'
import {Navigate , Routes , Route} from "react-router";
import {Toaster} from "react-hot-toast";
import Layout from "./components/Layout";
import useAuth from './hooks/useAuth'
import useThemeStore from "./store/useThemeStore.js";
import NotificationPage from "./pages/NotificationPage.jsx";
import PageLoader from "./components/PageLoader.jsx";
import ChatPage from './pages/ChatPage.jsx'



function App() {
 
  const {isLoading , authUser} = useAuth();
  const {theme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
useEffect(() => {
  console.log("auth" , isAuthenticated);
}, [])

  if(isLoading) return <PageLoader />

  return (
    <div className='h-screen' data-theme = {theme}>
      <Routes>

        <Route 
        path='/'
        element ={
          isAuthenticated && isOnboarded ? (
            <Layout showSidebar= {true}>
                <HomePage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
        />

        <Route
         path='/signup'
         element = {
          !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
         }
        />

        <Route
        path='/login'
        element = {
          !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
        }
        />

        <Route 
        path='/notifications'
        element = {
          isAuthenticated && isOnboarded ? (
            <Layout showSidebar = {true} >
              <NotificationPage />
            </Layout>
          ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
        />
        <Route
        path='/chat/:id'
        element = {
          isAuthenticated && isOnboarded ? (
            <Layout showSidebar = {false} > <ChatPage /> </Layout>
          ) : (
             <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
        />

        <Route
        path='/onboarding'
        element = {
          isAuthenticated ? (
            !isOnboarded ? (
              <OnBoarding />
            ) : (
              <Navigate to={"/"} />
            )
          ) : (
            <Navigate to={"/login"} />
          )
        }
        />
       
      </Routes>
        <Toaster />
    </div>
  );
};

export default App
