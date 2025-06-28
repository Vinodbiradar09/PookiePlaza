import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from "../lib/api";

const useLogin = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending, error, data } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log("Login successful, data:", data); 
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            console.error("Login failed:", error); 
        }
    });
    
    return {
        error,
        isPending,
        loginMutation: mutate,
        data // Return the response data
    }
}

export default useLogin;