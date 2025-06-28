import {  useQuery } from "@tanstack/react-query";
import {currentUser} from "../lib/api";


const useAuth = () => {
 const authUser = useQuery({
    queryKey : ["authUser"],
    queryFn : currentUser,
    retry : false,
 });

 return {isLoading : authUser.isLoading , authUser : authUser.data?.user}
}

export default useAuth
