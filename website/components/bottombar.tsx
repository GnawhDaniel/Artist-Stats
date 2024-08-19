"use client";
import { navigate } from '@/functions/actions';
import { HomeIcon, PresentationChartLineIcon, Cog8ToothIcon, ArrowRightStartOnRectangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'

export default function BottomBar() {

  const logOut = async () => {
    const response = await fetch('/api/deletecookie', {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status == 200) {
      navigate("/")
    }
  }

  return (
      <div className="block sm:hidden fixed bottom-0 bg-[#141414] w-full">
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex p-2 mt-1 h-12 justify-evenly">
          <HomeIcon onClick={()=>navigate("/dashboard")} className='hover:cursor-pointer'></HomeIcon>
          <PresentationChartLineIcon onClick={()=>navigate("/graph")} className='hover:cursor-pointer' ></PresentationChartLineIcon>
          <Cog8ToothIcon onClick={()=>navigate("/settings")} className='hover:cursor-pointer'></Cog8ToothIcon>
          <QuestionMarkCircleIcon onClick={()=>navigate("/faq")} className='hover:cursor-pointer'></QuestionMarkCircleIcon>
          <ArrowRightStartOnRectangleIcon onClick={()=>logOut()} className='hover:cursor-pointer'></ArrowRightStartOnRectangleIcon>
        </div>
      </div>
  );
}
