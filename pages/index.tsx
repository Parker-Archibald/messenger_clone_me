import {AiOutlineSearch} from 'react-icons/ai'
import Stories from '@/components/Stories'

export default function Home() {
  return (
    <main>
      
    {/* search */}

    <div className='flex mt-9 mx-8 items-center'>
      <AiOutlineSearch className='text-2xl absolute ml-2 mt-1'/>
      <input type='text' className='w-full rounded-full indent-10 text-white bg-gray-600 py-2 text-xl focus:outline-none'/>
    </div>

    {/* Stories */}

    <section>
      <Stories/>
    </section>

    </main>
  )
}
