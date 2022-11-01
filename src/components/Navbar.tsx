import { memo } from 'react';

const Navbar = memo(() => {
  return (
    <nav className='flex justify-center items-center fixed w-full h-16 tracking-[0.5rem] text-3xl shadow-md bg-white z-50'>
      ポケモン図鑑
    </nav>
  )
})

export default Navbar