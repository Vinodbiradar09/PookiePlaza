import { axiosInstances } from "./axios";


const signUp = async (signUpData)=>{
  const response = await axiosInstances.post("/api/v1/auth/register" ,signUpData);
  return response.data.data;
}

const login = async (loginData)=>{
 const response = await axiosInstances.post("/api/v1/auth/login" , loginData);
   return response.data.data;
   
}

const logout = async () =>{
  const response = await axiosInstances.post("/api/v1/auth/logout" );
  return response.data;
}

const currentUser = async ()=>{
  try {
    const response = await axiosInstances.get("/api/v1/auth/user");

    return response.data.data;
  } catch (error) {
      console.log("error in getting the current user" , error.message);
      return null;
  }
}

const completeOnBoarding = async (userData)=>{
    const response = await axiosInstances.post("/api/v1/auth/board" , userData);
    return response.data;
}


const getUsersFriends = async ()=>{
  const response = await axiosInstances.get("/api/v1/user/getMyFrnds");

  return response.data.data.friends;
}

const getRecommendedUsers = async ()=>{
  const response = await axiosInstances.get("/api/v1/user/recomendation");

  return response.data.data;
}

const getOutGoingFriendReq = async ()=>{
  const response = await axiosInstances.get("/api/v1/user/outgoingreqs");

  return response.data;
}

const sendFriendRequest = async (receiverId)=>{

  console.log("T" , receiverId);
  const response = await axiosInstances.post(`/api/v1/user/sendReq/${receiverId}`);

  return response.data.data;
}

const getFriendRequest = async ()=>{
  const response = await axiosInstances.get("/api/v1/user/friendreq");

  return response.data.data;
}

const acceptFriendRequest = async (friendRequestId)=>{
  const response = await axiosInstances.put(`/api/v1/user/acceptReq/${friendRequestId}`);
  return response.data;
}

const getStreamTokens = async ()=>{
  const response = await axiosInstances.get("/api/v1/chat/token");
  return response.data.data;
}



export { signUp,login ,logout , currentUser , completeOnBoarding , getUsersFriends , getRecommendedUsers , getFriendRequest , getOutGoingFriendReq , sendFriendRequest , acceptFriendRequest , getStreamTokens};