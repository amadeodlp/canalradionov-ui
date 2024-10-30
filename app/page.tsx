"use client"
import { ActionsButton } from "@components/Molecules/ActionsButton/ActionsButton";
import { useRouter } from "next/navigation";
function Home() {
  const router = useRouter();

  return (
<div className="w-screen h-screen flex flex-col">
  {/* Top bar containing the ActionsButton */}
  <div className="w-full flex justify-end p-4">
    <ActionsButton
      profilePicture="/assets/profilepic.jpg"
      classnames=""
      variant="transparent"
    >
      Hello, Amadeo
    </ActionsButton>
  </div>

  {/* Main content centered both vertically and horizontally */}
  <div className="flex-grow flex items-center justify-center">
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg w-100 gap-4">
      <h1 className="font-bold">Welcome to the Home Page!</h1>
      <p className="text-center">This page is only accessible to authenticated users.</p>
    </div>
  </div>
</div>
  )
}

export default Home;