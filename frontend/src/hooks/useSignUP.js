import {useQueryClient , useMutation} from "@tanstack/react-query";
import {signUp} from "../lib/api";



const useSignUP =  ()=>{
    const queryClient = useQueryClient();

    const {mutate , error , isPending , data} = useMutation({
        mutationFn : signUp,
        onSuccess : (data)=>{
            console.log("d" , data);
            queryClient.invalidateQueries({queryKey : ["authUser"]});
        },
        onError : (error)=>{
            console.error("signup failed" , error.message);
        }

    })

    return {
        error,
        isPending,
        signupMutation : mutate,
        data,
    }
};

export default useSignUP;
