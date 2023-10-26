import { AiOutlineSearch } from 'react-icons/ai'
import Stories from '@/components/Stories'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FiLogOut } from 'react-icons/fi'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { BsMessenger } from 'react-icons/bs'
import { db } from '../Firebase'
import { onSnapshot, collection, doc, setDoc, query, getDoc, addDoc, orderBy } from 'firebase/firestore';
import {TbMessageCirclePlus} from 'react-icons/tb'
import {useRecoilState} from 'recoil'
import {NewMessageModalState} from '@/atoms/NewMessageAtom'
import AddMessageModal from '@/components/AddMessageModal'
import NewMessage from '@/components/NewMessage'
import {SelectedMessageState} from '@/atoms/SelectedMessageAtom'

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([])
  const [messageModal, setMessageModal] = useRecoilState(NewMessageModalState)
  const [selectedMessageAtom, setSelectedMessage] = useRecoilState(SelectedMessageState)

  useEffect(() => {
    if(session) {

      try {
        onSnapshot(doc(db, "Users", session.user.uid), snapshot => {
          if(snapshot.data() === undefined) {
            setDoc(doc(db, 'Users', session.user.uid), {
              name: session.user.name,
              image: session.user.image
            })
          }
          else {
            onSnapshot(query(collection(db, 'Users', session.user.uid, 'Conversations'), orderBy('timeStamp', 'desc')), snapShot => {
              let snap = snapShot.docs
              setMessages(snap)
            })
          }
        })
      } catch(error) {
        console.log(error)
      }
    }
  }, [session])

  const openChat = (message) => {
    // setSelectedMessage(message.id)
    router.push(`/messages/${message.id}`)
  }

  if (session) {
    return (
      <main className='h-screen'>

        {/* Top */}

        <div className='w-screen flex justify-end p-4 space-x-4'>
          <button><BiMessageRoundedAdd className='text-2xl hover:text-white hover:animate-bounce'  onClick={() => setMessageModal(true)}/></button>
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

        <section className='py-4 h-[64%] overflow-y-scroll'>
          {messages?.length < 1 ? (
            <div className='flex flex-col items-center space-y-4 text-2xl mt-8'>
              <div>No messages</div>
              <TbMessageCirclePlus className="text-4xl" onClick={() => setMessageModal(true)}/>
            </div>
          ) : (
            <div className='flex flex-col justify-center'>
              {messages?.map(message => (
                <div key={message.id} className='flex items-center w-full space-x-4 p-4 hover:bg-gray-800' onClick={() => openChat(message)}>
                  <img src={message.data().withPerson.image} className='w-16 h-16 rounded-full'/>
                  <div className='flex flex-col text-2xl'>
                    <p>{message.data().withPerson.name}</p>
                    <p className='text-white'>{message.data().latestMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AddMessageModal/>

        <NewMessage/>

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
