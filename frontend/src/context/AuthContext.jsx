import { createContext, useEffect, useState } from "react";
import { getUser } from "../utils/fetchApi";

export const AuthContext = createContext();

const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() =>{
        const fetchUser = async () => {
            setAuthLoading(true);
            const result = await getUser();

            if(result?.data?.user){
              setUser(result.data.user);
              setAuthLoading(false);
            }else{
              setUser(null);
              setAuthLoading(false);
            }
          }
          fetchUser();
    }, []);

    if(authLoading) return <> </> ; // Don't show anything while loading

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;