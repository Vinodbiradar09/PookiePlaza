import React,{useState} from 'react'
import useLogin from '../hooks/useLogin'
import {HandHeart} from "lucide-react"
import {Link} from "react-router"

const LoginPage = () => {
    const [loginData , setLoginData] = useState({
        email : "",
        password : "",
    });

    const {isPending , error , loginMutation} = useLogin();

    const handleLogin = async (e) => {
        e.preventDefault();
      
       
        loginMutation(loginData, {
            onSuccess: (data) => {
                console.log("Login successful", data.loggedUser);
                // Handle successful login here
                // e.g., redirect to dashboard, store user data, etc.
            },
            onError: (error) => {
                console.log("Login failed:", error);
                // Error is already handled in the hook, but you can add additional logic here
            }
        }); 
    }

    return (
        <div
            className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="forest"
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <HandHeart className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            PookiePlaza
                        </span>
                    </div>

                 
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error.response?.data?.message || 'Login failed'}</span>
                        </div>
                    )}

                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back Pookies</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to your account to continue your pookie journey
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                Create one
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

              
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                      
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
    )
}

export default LoginPage