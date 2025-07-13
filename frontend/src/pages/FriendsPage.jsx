// pages/FriendsPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsersFriends } from '../lib/api';
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';

const FriendsPage = () => {
  const { 
    data: friendsData = {}, 
    isLoading: loadingFriends, 
    error 
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUsersFriends,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const friends = friendsData?.friends || [];

  if (loadingFriends) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Your Pookies 🌸</h2>
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Your Pookies 🌸</h2>
          <div className="card bg-error text-error-content p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Error Loading Friends</h3>
            <p>Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Your Pookies 🌸</h2>
          <NoFriendsFound />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Your Pookies 🌸</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;