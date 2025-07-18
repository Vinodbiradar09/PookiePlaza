
import { Link, useLocation } from 'react-router';
import { BellIcon, LogOutIcon, HandHeart , HomeIcon } from "lucide-react";
import ThemeSelector from './ThemeSelector';
import useAuth from "../hooks/useAuth"
import useLogout from '../hooks/useLogout';


const Navbar = () => {
    const { authUser } = useAuth();
    const { logoutMutation } = useLogout();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
      const currentPath = location.pathname;
    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {isChatPage && (
                        <div className='pl-5'>
                            <Link to="/" className='flex items-center gap-2.5'>
                                <HandHeart className='size-9 text-primary' />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                                    PookiePlaza
                                </span>

                            </Link>
                        </div>
                    )}

                    {/* <div >
                        <Link to="/"
                            // className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""
                            //     }`}
                        >
                            <HomeIcon className="h-6 w-6 text-base-content opacity-70"/>
                            <span>Home</span>
                        </Link>
                    </div> */}

                    <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                        <Link to={"/notifications"}>
                            <button className='btn btn-ghost btn-circle'>
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    <ThemeSelector />


                    <div className='avatar'>
                        <div className='w-9 rounded-full'>
                            <img src={authUser?.profilePic} alt="user avatar" rel='noreferrer' />
                        </div>
                    </div>

                    <button onClick={logoutMutation} className='btn btn-ghost btn-circle'>
                        <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                    </button>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
