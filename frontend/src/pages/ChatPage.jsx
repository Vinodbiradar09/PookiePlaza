import React, { useState } from 'react'
import {useQuery} from "@tanstack/react-query";
import { getStreamTokens } from '../lib/api';
import {useParams} from "react-router";
import useAuth from '../hooks/useAuth';
import {StreamChat} from "stream-chat";
import {Chat , Channel , ChannelHeader , MessageList , MessageInput , Thread , Window} from "stream-chat-react";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY


const ChatPage = () => {
  const {id:targetUserId} = useParams();
  const [chatClient  , setChatClient] = useState(null);
  const [channel , setChannel] = useState(null);
  const [loading , setLoading] = useState(true);

  const {authUser} = useAuth();
  const {data : tokenData , error} = useQuery({
   queryKey : ["streamToken"],
   queryFn : getStreamTokens,
   enabled : !!authUser,
  })
  console.log("error in token" , error);
  console.log("token data" , tokenData);

  useEffect(() => {
    const initChat = async()=>{
      if(!tokenData?.tokens || !authUser) return ;

      try {
        console.log("initializing the stream-chat");
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id : authUser?._id,
            name : authUser?.fullName,
            image : authUser?.profilePic
          },
          tokenData.tokens
        );

        const channelId = [authUser._id , targetUserId].sort().join("-");

        const currChannel = client.channel("messaging" , channelId , {
          members : [authUser._id , targetUserId],
        });

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
          console.error("Error while connecting to the chat");
          toast.error("Could not connect to the chat please try again");
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [tokenData , authUser , targetUserId]);

  const handleVideoCall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text : `I have started a video call. Join me here : ${callUrl}`,
      });

      toast.success("Video call link sent successfully")
    }
  };


  if(loading || !channel || !chatClient) return <ChatLoader />
  

  return (
    <div  className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
      
    </div>
  );
};

export default ChatPage
