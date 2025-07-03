import React from 'react'
import {useQuery} from "@tanstack/react-query";
import { getStreamTokens } from '../lib/api';
import {useParams} from "react-router";
import useAuth from '../hooks/useAuth';
import {StreamChat} from "stream-chat";
import {Chat , Channel , ChannelHeader , MessageList , MessageInput , Thread , Window} from "stream-chat-react";

const ChatPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default ChatPage
