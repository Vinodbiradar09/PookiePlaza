import React, { useState } from 'react';
import { HandHeart } from "lucide-react";
import { Link, useNavigate } from 'react-router';
import useSignUP from '../hooks/useSignUP';

const SignUpPage = () => {

    const [signUpData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        profilePic: null
    });

    const navigate = useNavigate();

   
    const [fileError , setFileError] = useState("");

    const { isPending, error, signupMutation } = useSignUP();

    const handleProfile = (e) =>{
        const file = e.target.files[0];
        if(!file){
            setFileError("Please select a file");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if(!allowedTypes.includes(file.type)){
            setFileError("Please select a valid file type");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if(file.size > maxSize){
            setFileError("the file must be 5mb only");
            return;
        }

        setFileError("");

        setSignupData({...signUpData , profilePic : file});


    }
   
    const handleSignup = (e) => {
        e.preventDefault();

        setFileError("");
        const formData = new FormData();
        formData.append("fullName" , signUpData.fullName);
        formData.append("email" , signUpData.email);
        formData.append("password" , signUpData.password);

        if(signUpData.profilePic){
             formData.append("profilePic" , signUpData.profilePic);
        }
       
        signupMutation(formData, {
            onSuccess: (data) => {
                navigate("/login");
                // console.log("registered", data.user);
            },
            onError: (error) => {
                console.log("registered failed", error);
            }
        });

    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="forest">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <HandHeart className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            PookiePlaza
                        </span>
                    </div>
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span> {error.response.data.message}</span>
                        </div>
                    )}

                    {
                        fileError && (
                            <div className="alert alert-warning mb-4">
                            <span>{fileError}</span>
                        </div>
                        )
                    }

                    <div className="w-full">
                        <form onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className='text-xl font-semibold'>Create an Account</h2>
                                    <p className='text-sm opacity-70'>
                                        Join PookiePlaza and share your love stories, one heartbeat at a time. 💫🖋️💕 
                                    </p>

                                </div>
                                <div className='space-y-3'>
                                    <div className='form-control w-full'>
                                        <label className='label'>
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='Harkirat Singh'
                                            required
                                            className="input input-bordered w-full"
                                            value={signUpData.fullName}
                                            onChange={(e) => setSignupData({ ...signUpData, fullName: e.target.value })} />
                                    </div>
                                    <div className='form-control w-full'>
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder='harkirat@gmail.com'
                                            required
                                            value={signUpData.email}
                                            onChange={(e) => setSignupData({ ...signUpData, email: e.target.value })}
                                            className="input input-bordered w-full"
                                        />
                                    </div>

                                    <div className='form-control w-full'>
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder='*******'
                                            value={signUpData.password}
                                            onChange={(e) => setSignupData({ ...signUpData, password: e.target.value })}
                                            className="input input-bordered w-full"
                                        />
                                        <p className="text-xs opacity-70 mt-1">
                                           Hey Pookie, Password must be at least 6 characters long
                                        </p>
                                    </div>

                                    <div className='form-control w-full'>
                                        <label className='label' >
                                            <span className='label-text'>
                                                Profile
                                            </span>
                                        </label>
                                        <input type="file"
                                        required
                                        accept='image/*'
                                        onChange={handleProfile}
                                        className="file-input file-input-bordered w-full"
                                        />
                                        {signUpData.profilePic && (
                                            <p className='text-xs text-success mt-1'> 
                                                Selected : {signUpData.profilePic.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" className="checkbox checkbox-sm" required />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary w-full" type="submit">
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Loading...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )

                                    }
                                </button>
                                <div className="text-center mt-4">
                                    <p className='text-sm'>
                                        Already have an account?{" "}
                                        <Link to="/login" className='text-primary hover:underline'>
                                            Sign in
                                        </Link>

                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>


                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/love.jpeg" alt="Language connection illustration" className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Find your forever pookie.</h2>
                            <p className="opacity-70">
                               Laugh, love, and grow together — one sweet message at a time. ✨💌🌍
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SignUpPage
