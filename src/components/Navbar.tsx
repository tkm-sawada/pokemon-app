import { memo } from 'react';

const Navbar = memo(() => {
  return (
    <nav className='flex justify-center items-center h-16 font-semibold text-2xl bg-red-800 text-white '>
      ポケモン図鑑
    </nav>
  )
})

export default Navbar