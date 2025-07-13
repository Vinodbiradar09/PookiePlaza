import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OnBoarding from './pages/OnBoarding'
import HomePage from './pages/HomePage'
import { Navigate, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import useAuth from './hooks/useAuth'
import useThemeStore from "./store/useThemeStore.js";
import NotificationPage from "./pages/NotificationPage.jsx";
import PageLoader from "./components/PageLoader.jsx";
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import FriendsPage from './pages/FriendsPage.jsx'

function App() {
  const { isLoading, authUser } = useAuth();
  const { theme, initializeTheme, isInitialized } = useThemeStore();

  // Initialize theme from localStorage when app starts
  useEffect(() => {
    console.log("App mounted, initializing theme...");
    initializeTheme();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (theme) {
      console.log("Theme changed to:", theme);
      
      // Apply theme to HTML element (most important for DaisyUI)
      document.documentElement.setAttribute('data-theme', theme);
      
      // Also apply to body for extra compatibility
      document.body.setAttribute('data-theme', theme);
      
      // Debug: Check if theme is applied
      setTimeout(() => {
        console.log("HTML data-theme:", document.documentElement.getAttribute('data-theme'));
        console.log("Body data-theme:", document.body.getAttribute('data-theme'));
      }, 100);
    }
  }, [theme]);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />

  return (
    // Remove data-theme from here as it's now applied to HTML element
    <div className='h-screen bg-base-100 text-base-content'>
      {/* Debug info */}
      {/* <div className="fixed top-0 right-0 bg-primary text-primary-content p-2 text-xs z-50">
        Current theme: {theme}
      </div> */}
      
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path='/signup'
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />

        <Route
          path='/login'
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />

        <Route
          path='/friends'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path='/notifications'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true} >
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
        <Route
          path='/chat/:id'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false} > <ChatPage /> </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path='/onboarding'
          element={
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