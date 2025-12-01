"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #264653 0%, #2a9d8f 100%)',
      color: '#e9c46a',
      fontFamily: 'BPdots, monospace',
      gap: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        margin: 0,
        textShadow: '2px 2px 0 #f4a261, 4px 4px 0 #e76f51',
        letterSpacing: '3px'
      }}>FAMILIADA</h1>
      <div style={{
        width: '60px',
        height: '60px',
        border: '6px solid rgba(233, 196, 106, 0.3)',
        borderTop: '6px solid #e9c46a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Page;
