"use client"
import { Button } from "@components/atoms/Button/Button";
import { Logo } from "@components/atoms/Logo/Logo";
import { useRouter } from "next/navigation";
function Logout() {
  const router = useRouter();
  const handleLogin = () => {    
    router.push('/login');
  };

  return (
<div className="w-screen h-screen flex flex-col">
  <div className="flex-grow flex items-center justify-center">
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg w-100 gap-6">
      <Logo src="/assets/canalradionovlogo.png" />
      <h1 className="font-bold">You are now logged out</h1>
      <Button onClick={handleLogin} variant="blue">Login again</Button>
    </div>
  </div>
</div>
  )
}

export default Logout;