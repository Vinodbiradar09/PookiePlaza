import React, {useEffect} from 'react'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationFound from "../components/NoNotificationFound";
import { acceptFriendRequest, getFriendRequest } from "../lib/api";


const NotificationPage = () => {
    const queryClient = useQueryClient();

    const { data: friendRequests = {}, isLoading, error } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequest,
    })

    const { mutate: acceptRequestMutation, isPending, data } = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: (data) => {
            console.log("notification", data);
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
            queryClient.invalidateQueries({ queryKey: ["friends"] });
        }
    });

    const incomingRequests = friendRequests?.incomingreqs || [];
    const acceptedRequests = friendRequests?.acceptedreqs || [];

    useEffect(() => {
       console.log("Full friendRequests object:", friendRequests);
       console.log("incomingRequests:", incomingRequests);
       console.log("isLoading:", isLoading);
       console.log("error:", error);
       
       // Debug each request
       incomingRequests.forEach((request, index) => {
           console.log(`Request ${index}:`, request);
           console.log(`Request ${index} sender:`, request.sender);
           console.log(`Request ${index} sender exists:`, !!request.sender);
       });
    }, [friendRequests, incomingRequests, isLoading, error])

    // Add error handling
    if (error) {
        console.error("Query error:", error);
        return <div>Error loading notifications: {error.message}</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <>
                        {incomingRequests.length > 0 && (
                            <section className='space-y-4'>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <UserCheckIcon className="h-5 w-5 text-primary" />
                                    Friend Requests
                                    <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                                </h2>

                                <div className='space-y-3'>
                                    {incomingRequests.map((request) => {
                                        // Add safety check for each request
                                        if (!request || !request.sender) {
                                            console.warn("Skipping request with null/undefined sender:", request);
                                            return null;
                                        }

                                        return (
                                            <div key={request._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="card-body p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                                                <img 
                                                                    src={request.sender?.profilePic || '/default-avatar.png'} 
                                                                    alt={request.sender?.fullName || 'Unknown User'} 
                                                                    onError={(e) => {
                                                                        console.log("Image failed to load:", request.sender?.profilePic);
                                                                        e.target.src = '/default-avatar.png';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h3 className='font-semibold'>{request.sender?.fullName || 'Unknown User'}</h3>
                                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                                    <span className="badge badge-secondary badge-sm">
                                                                        Native: {request.sender?.nativeLanguage || 'N/A'}
                                                                    </span>
                                                                    <span>
                                                                        Looking For: {request.sender?.learningLanguage || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button className="btn btn-primary btn-sm"
                                                            onClick={() => acceptRequestMutation(request._id)}
                                                            disabled={isPending}
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {acceptedRequests.length > 0 && (
                            <section className='space-y-4'>
                                <h2>
                                    <BellIcon className="h-5 w-5 text-success" />
                                    New Connections
                                </h2>
                                <div className='space-y-3'>
                                    {acceptedRequests.map((notification) => (
                                        <div key={notification._id} className="card bg-base-200 shadow-sm">
                                            <div className="card-body p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="avatar mt-1 size-10 rounded-full">
                                                        <img 
                                                            src={notification.receiver?.profilePic || '/default-avatar.png'} 
                                                            alt={notification.receiver?.fullName || 'Unknown User'} 
                                                        />
                                                    </div>
                                                    <div className='flex-1'>
                                                        <h3 className='font-semibold'>{notification.receiver?.fullName || 'Unknown User'}</h3>
                                                        <p className='text-sm my-1'>
                                                            {notification.receiver?.fullName || 'Someone'} accepted your Friend request
                                                        </p>
                                                        <p className="text-xs flex items-center opacity-70">
                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                            Recently
                                                        </p>
                                                    </div>
                                                    <div className="badge badge-success">
                                                    <MessageSquareIcon className="h-3 w-3 mr-1" />
                                                    New Friend
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
                            <NoNotificationFound />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationPage