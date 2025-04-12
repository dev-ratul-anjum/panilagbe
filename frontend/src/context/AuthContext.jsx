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

    if(authLoading) return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom, #e6f7ff, #ffffff)' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', overflow: 'visible' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${8 + Math.random() * 7}px`,
              height: `${15 + Math.random() * 10}px`,
              backgroundColor: 'rgba(74, 144, 226, 0.8)',
              borderRadius: '50% 50% 50% 50%',
              left: `${Math.random() * 180}px`,
              top: '0px',
              animation: `waterDrop ${1 + Math.random() * 0.5}s infinite ${i * 0.2}s ease-in`,
              boxShadow: '0 0 5px rgba(74, 144, 226, 0.5)'
            }}/>
          ))}
          <div style={{ 
            position: 'absolute', 
            bottom: '0', 
            left: '0',
            width: '100%', 
            height: '40px', 
            background: 'rgba(74, 144, 226, 0.3)',
            borderRadius: '50%',
            animation: 'waterRipple 2s infinite'
          }}></div>
          <style>{`
            @keyframes waterDrop {
              0% { transform: translateY(0) scale(1); opacity: 0.9; }
              80% { transform: translateY(160px) scale(0.8); opacity: 0.8; }
              100% { transform: translateY(160px) scale(0.2); opacity: 0; }
            }
            @keyframes waterRipple {
              0% { transform: scale(0.5); opacity: 0.7; }
              50% { transform: scale(1.2); opacity: 0.5; }
              100% { transform: scale(0.5); opacity: 0.7; }
            }
          `}</style>
        </div>
      </div>
    );

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;