import React, { useState, useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { data, useNavigate, useParams } from 'react-router';
import { getStreamTokens } from '../lib/api';
import useAuth from '../hooks/useAuth';

import { StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, StreamTheme, useCallStateHooks, CallingState } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/style.css";
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
    const { id: callId } = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    const { authUser, isLoading } = useAuth();

    const { data: tokenData, error } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamTokens,
        enabled: !!authUser
    });

    useEffect(() => {
        console.log("error occured in getting the token", error);
        console.log("data of tokem", tokenData);
    }, [])

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.tokens || !authUser || !callId) return;
            try {
                console.log(" getting to the  stream video call");
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                }
                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.tokens,
                });

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({ create: true });

                console.log("Joined call successfully");
                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.log("error in joining the call", error);
                toast.error("Could not join the call ! , please try again later");
            }
            finally {
                setIsConnecting(false)
            }
        };
        initCall();
    }, [tokenData, authUser, callId]);

    if (isLoading || isConnecting) return <PageLoader />



    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className='relative'>
                {
                    client && call ? (
                        <StreamVideo client={client}>
                            <StreamCall call={call}>
                                <CallContent />
                            </StreamCall>
                        </StreamVideo>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>Could not initialize call. Please refresh or try again later.</p>
                        </div>
                    )
                }

            </div>

        </div>
    )
};

const CallContent = ()=>{
    const {useCallCallingState} = useCallStateHooks();

    const callingState  = useCallCallingState();

    const navigate = useNavigate();

    if(callingState === CallingState.LEFT) return navigate("/");

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    )
}

export default CallPage


