import React, { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from '../constants';
import useAuth from "../hooks/useAuth";
import { completeOnBoarding } from "../lib/api"
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/collection";



const OnBoarding = () => {
    const { authUser } = useAuth();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        // profilePic : authUser.profilePic || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",

    })

    const { mutate: onboardingMutation, isPending, data } = useMutation({
        mutationFn: completeOnBoarding,
        onSuccess: (data) => {
            console.log("data updated for board", data);
            toast.success("profile onboarded successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },

        onError: (error) => {
            toast.error(error.response.data.message);
        }

    });



    const handleSubmit = (e) => {
        e.preventDefault();

        onboardingMutation(formState);
    };

    const handleRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const svg = createAvatar(style.bottts, { seed, size: 128 });

        setFormState({ ...formState, profilePic: svg });
        toast.success("Random avatar generated");
    }



    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {authUser.profilePic ? (
                                    <img src={authUser.profilePic} alt="profile-preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <CameraIcon className="size-12 text-base-content opacity-40" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent' >
                                    <ShuffleIcon className='size-4 mr-2' />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        {/* fullName */}

                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>FullName</span>
                            </label>
                            <input
                                type="text"
                                name='fullName'
                                value={formState.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* bio */}
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="textarea textarea-bordered h-24"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </div>
                        {/* lang */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* native */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Native </span>
                                </label>
                                <select
                                    name="nativeLanguage"
                                    value={formState.nativeLanguage}
                                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Your Native Language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>

                            </div>


                            {/* learning language */}

                            <div className='form-control'>
                                <label className='label'>
                                    <span className="label-text"> Looking For</span>
                                </label>

                                <select name="learningLanguage"
                                    value={formState.learningLanguage}
                                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">
                                        Select language you're willing to connect
                                    </option>

                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>
                        {/* location */}
                            
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Location</span>
                                </label>

                                <div className='relative'>
                                    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                    <input type="text"
                                    name='location'
                                    value={formState.location}
                                    onChange={(e)=> setFormState({... formState , location:e.target.value})}
                                    className="input input-bordered w-full pl-10"
                                      placeholder="City, Country"
                                    />
                                </div>
                            </div>
                            
                            {/* submit */}
                            <button className="btn btn-primary w-full"  disabled={isPending} type='submit'>
                                    {isPending ? (
                                        <>
                                        <ShipWheelIcon className="size-5 mr-2" />
                                         Complete Onboarding
                                        </>
                                    ) : (
                                        <>
                                        <LoaderIcon className="animate-spin size-5 mr-2" />
                                         Onboarding...
                                        </>
                                    )
                                
                                }
                            </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OnBoarding
