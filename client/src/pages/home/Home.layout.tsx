import backgroundImage from '@/assets/home-bg.webp'
import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { TopRibbon } from './TopRibbon'

export const HomeLayout = () => {
  return (
    <div className="relative h-full">
      <div className="relative z-10 h-full grid grid-rows-[max-content,minmax(0,1fr),max-content]">
        <TopRibbon />

        <Outlet />

        <Navigation />
      </div>

      <img
        src={backgroundImage}
        className="bg-black object-cover object-bottom absolute top-0 left-0 right-0 w-full h-full z-0"
      />
    </div>
  )
}
