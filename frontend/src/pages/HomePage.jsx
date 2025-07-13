import React, { useState, useEffect } from 'react'
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UserIcon } from "lucide-react";
import { Link } from 'react-router';
import { sendFriendRequest, getUsersFriends, getOutGoingFriendReq, getRecommendedUsers } from "../lib/api";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from '../lib/utils';
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
    const queryClient = useQueryClient();
    const [outGoingReqsIds, setOutGoingReqsIds] = useState(new Set());

    // Fix: Updated variable name for clarity
    const { data: friendsData = {}, isLoading: loadingFriends, error: friendsError } = useQuery({
        queryKey: ["friends"],
        queryFn: getUsersFriends,
    });

    // Fix: Accessing friends from the correct data structure
    const friends = friendsData?.friends || [];
    const pagination = friendsData?.pagination || {};

    const { data: recommendUsers = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers,
    });

    const { data: outGoingFriendReqs } = useQuery({
        queryKey: ["outGoingFriendReqs"],
        queryFn: getOutGoingFriendReq,
    });

    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        onMutate: (receiverId) => {
            setOutGoingReqsIds(prev => new Set(prev).add(receiverId));
        },
        onSuccess: (data) => {
            console.log("friend request is sent", data);
            queryClient.invalidateQueries({ queryKey: ["outGoingFriendReqs"] });
        },
        onError: (error, receiverId) => {
            setOutGoingReqsIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(receiverId);
                return newSet;
            });
            console.log("error occurred while sending friend request", error.message);
        }
    });

    useEffect(() => {
        const outGoingIds = new Set();
        if (outGoingFriendReqs && outGoingFriendReqs.length > 0) {
            outGoingFriendReqs.forEach((req) => {
                outGoingIds.add(req.receiver._id);
            });
            setOutGoingReqsIds(outGoingIds);
        }
    }, [outGoingFriendReqs]);

    useEffect(() => {
        console.log("friendsData", friendsData);
        console.log("friends", friends);
        console.log("recommendUsers", recommendUsers);
        console.log("outGoingReqsIds", outGoingReqsIds);
    }, [friendsData, friends, recommendUsers, outGoingReqsIds]);

    // Add error handling
    if (friendsError) {
        console.error("Error fetching friends:", friendsError);
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className='container mx-auto space-y-10'>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to={"/notifications"} className='btn btn-outline btn-sm'>
                        <UserIcon className='mr-2 size-4' />
                        Friend Requests
                    </Link>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : friendsError ? (
                    <div className="card bg-error text-error-content p-6 text-center">
                        <h3 className="font-semibold text-lg mb-2">Error Loading Friends</h3>
                        <p>Please try refreshing the page</p>
                    </div>
                ) : friends.length === 0 ? (
                    <NoFriendsFound />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                        ))}
                    </div>
                )}

                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Pookies</h2>
                                <p className="opacity-70">
                                    Discover perfect love , exchange hearts ♥️  messages 💌 and Nuture your love
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingUsers ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recommendUsers.length === 0 ? (
                        <div className="card bg-base-200 p-6 text-center">
                            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                            <p className="text-base-content opacity-70">
                                Check back later for new Pookie partners!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendUsers.map((user) => {
                                const hasRequestBeenSent = outGoingReqsIds.has(user._id);

                                return (
                                    <div
                                        key={user._id}
                                        className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="card-body p-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar size-16 rounded-full">
                                                    <img 
                                                        src={user.profilePic || '/default-avatar.png'} 
                                                        alt={user.fullName || 'User'} 
                                                        onError={(e) => {
                                                            e.target.src = '/default-avatar.png';
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                                    {user.location && (
                                                        <div className="flex items-center text-xs opacity-70 mt-1">
                                                            <MapPinIcon className="size-3 mr-1" />
                                                            {user.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="badge badge-secondary">
                                                    {getLanguageFlag(user.nativeLanguage)}
                                                    Native: {capitialize(user.nativeLanguage)}
                                                </span>
                                                <span className="badge badge-outline">
                                                    {getLanguageFlag(user.learningLanguage)}
                                                    Looking For: {capitialize(user.learningLanguage)}
                                                </span>
                                            </div>

                                            {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                                            <button
                                                className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                                                onClick={() => sendRequestMutation(user._id)}
                                                disabled={hasRequestBeenSent || isPending}
                                            >
                                                {hasRequestBeenSent ? (
                                                    <>
                                                        <CheckCircleIcon className="size-4 mr-2" />
                                                        Request Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="size-4 mr-2" />
                                                        Send Friend Request
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;