import {Link} from "react-router";
import { useEffect } from "react";
import {LANGUAGE_TO_FLAG} from "../constants/index";

const FriendCard = ({friend}) => {
  console.log("friend data:", friend);

  // Add error handling for undefined friend
  if (!friend) {
    return (
      <div className="card bg-base-200 animate-pulse">
        <div className="card-body p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar size-12">
              <div className="bg-gray-300 rounded-full w-12 h-12"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img 
              src={friend.profilePic || '/default-avatar.png'} 
              alt={friend.fullName || 'User'} 
              onError={(e) => {
                e.target.src = '/default-avatar.png'; // Fallback image
              }}
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName || 'Unknown User'}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage || 'Unknown'}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Looking For: {friend.learningLanguage || 'Unknown'}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language){
  if(!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if(countryCode){
    return (
      <img 
        src={`https://flagcdn.com/24x18/${countryCode}.png`} 
        alt={`${langLower} flag`}  
        className="h-3 mr-1 inline-block"
        onError={(e) => {
          e.target.style.display = 'none'; // Hide broken flag images
        }}
      />
    );
  }

  return null;
}