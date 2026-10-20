type Props = {}

const AppSideBarFooter = (props: Props) => {
   return (
      <div className='flex flex-col gap-2 p-2 font-bold border-t'>
         <h1 className="text-sm font-sans text-white brightness-60">READING GOAL</h1>
         <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
               <p className='text-xl font-semibold'>15</p>
               <p className='text-xl'>/</p>
               <p className='text-base text-white brightness-50'>24 books</p>
            </div>
            <p className="text-white brightness-60">2026</p>
         </div>
         <div className='w-full h-2 rounded-full bg-accent'>

         </div>
         <div className='flex gap-2 text-white brightness-60'>
            <p className="text-sm">63% complete - 9 books to go</p>
         </div>
      </div>
   )
}

export default AppSideBarFooter