import { Heart } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

function Footer() {
  return (
    <div className='w-full h-16 bg-background border-t border-gray-200'>
        <div className='max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row items-center md:justify-between justify-center gap-2 px-4'>
            <p className='text-sm text-muted-foreground'>© 2026 Inkash. All rights reserved.</p>
            <p className='text-sm text-muted-foreground inline-flex items-center gap-1'>Made with <HugeiconsIcon icon={Heart} className='size-4 fill-red-500 animate-pulse' /> by <a href="https://taqui.vercel.app" className='text-foreground hover:underline'>Taqui</a></p>
        </div>
    </div>
  )
}

export default Footer