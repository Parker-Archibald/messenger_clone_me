import { AiOutlineSearch } from 'react-icons/ai'
import Stories from '@/components/Stories'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FiLogOut } from 'react-icons/fi'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { BsMessenger } from 'react-icons/bs'
import { db } from '../Firebase'
import { onSnapshot, collection, doc, setDoc } from 'firebase/firestore';
import {TbMessageCirclePlus} from 'react-icons/tb'
import {useRecoilState} from 'recoil'
import {NewMessageState} from '@/atoms/NewMessageAtom'
import AddMessageModal from '@/components/AddMessageModal'

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([])
  const [messageModal, setMessageModal] = useRecoilState(NewMessageState)

  useEffect(() => {
    if(session) {

      try {
        onSnapshot(doc(db, "Users", session.user.uid), snapshot => {
          if(snapshot.data() === undefined) {
            setDoc(doc(db, 'Users', session.user.uid), {
              name: session.user.name,
              image: session.user.image
            })
            .then(() => {
              onSnapshot(collection(db, 'Users', session.user.uid, 'Conversations'), snapshot => {
                let snap = snapshot.docs;
                setMessages(snap)
              })
            })
          }
          else {
            onSnapshot(collection(db, 'Users', session.user.uid, 'Conversations'), snapshot => {
              let snap = snapshot.docs;
              setMessages(snap)
            })
          }
        })
      } catch(error) {
        console.log(error)
      }
    }
  }, [session])

  if (session) {
    return (
      <main>

        {/* Top */}

        <div className='w-screen flex justify-end p-4 space-x-4'>
          <button><BiMessageRoundedAdd className='text-2xl hover:text-white hover:animate-bounce' /></button>
          <button onClick={() => signOut()}><FiLogOut className='text-2xl hover:text-white' /></button>
        </div>

        {/* search */}

        <div className='flex mt-9 mx-8 items-center'>
          <AiOutlineSearch className='text-2xl absolute ml-2 mt-1' />
          <input type='text' className='w-full rounded-full indent-10 text-white bg-gray-600 py-2 text-xl focus:outline-none' />
        </div>

        {/* Stories */}

        <section>
          <Stories />
        </section>

        {/* Messages */}

        <section>
          {messages?.length < 1 ? (
            <div className='flex flex-col items-center space-y-4 text-2xl mt-8'>
              <div>No messages</div>
              <TbMessageCirclePlus className="text-4xl"/>
            </div>
          ) : (
            <div className='flex flex-col justify-center'>
              <img src={messages[0].data().withImage} className='w-16 h-auto rounded-full'/>
              <p>{messages[0].data().withName}</p>
            </div>
          )}
        </section>

        <div><AddMessageModal/></div>

      </main>
    )
  }

  else {
    return (
      <div className='flex flex-col items-center justify-center text-2xl h-screen w-screene space-y-8'>
        <BsMessenger className='text-6xl' />
        <div onClick={signIn} className='hover:text-whit'>You will need to login first {':)'}</div>
      </div>
    )
  }
}
