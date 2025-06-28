import { useQueryClient , useMutation } from "@tanstack/react-query";
import {logout} from "../lib/api"

import React from 'react'

const useLogout = () => {
  const queryClient = useQueryClient();

  const {mutate , isPending , error , data} = useMutation({
        mutationFn : logout,
        onSuccess : (data)=>{
            console.log("logged out data" , data);
            queryClient.invalidateQueries({queryKey : ["authUser"]});
        },
        onError : (error)=>{
            console.log("error for loggedOut" , error);
        }
  });

  return {
   logoutMutation : mutate,
   isPending,
   error,
   data
 }
}

export default useLogout

