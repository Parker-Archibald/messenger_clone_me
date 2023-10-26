import { useEffect, useState } from "react"
import {addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc} from 'firebase/firestore'
import {db} from '@/firebase'
import {useSession} from 'next-auth/react'
import { useRouter } from "next/router"
import {BiArrowBack} from 'react-icons/bi'
import {BsFillTelephoneFill, BsFillCameraFill, BsImage} from 'react-icons/bs'
import {FaVideo, FaMicrophone, FaSmile} from 'react-icons/fa'
import {IoIosInformationCircle, IoIosAddCircle} from 'react-icons/io'
import {HiThumbUp} from 'react-icons/hi'
import {LuSendHorizonal} from 'react-icons/lu'

const Convo = () => {
    
    // const [selectedMessage, setSelectedMessage] = useRecoilState(SelectedMessageState)
    const {data: session} = useSession()
    const [allMessages, setAllMessages] = useState([])
    const [withPerson, setWithPerson] = useState([])
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        if(session) {
            onSnapshot(doc(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0]), snapShot => {
                setWithPerson(snapShot.data().withPerson)
            })

            onSnapshot(query(collection(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0], 'Messages'), orderBy('timeStamp', 'asc')), snapShot => {
                let snap = snapShot.docs
                setAllMessages(snap)
            })
            
        }
    }, [session])

    // console.log(router.query.convo[0])

    const handleFocus = (e) => {
        document.getElementById('bottomSearchContainer').style.width = '100%'
        document.getElementById('bottomIcons').style.width = '0px'
        document.getElementById(e.target.id).style.width = '20rem'
        document.getElementById('messageSmile').style.right = '3.75rem'
    }

    const handleBlur = (e) => {
        document.getElementById(e.target.id).style.width = '100%'
        document.getElementById('bottomSearchContainer').style.width = '50%'
        document.getElementById('bottomIcons').style.width = '50%'
        document.getElementById('messageSmile').style.right = '3.25rem'
    }

    const handleSend = async () => {
        
        await setDoc(doc(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0]), {
            withPerson: {
                name: withPerson.name,
                image: withPerson.image
            },
            latestMessage: message,
            timeStamp: serverTimestamp()
        })
        .then(() => {
            addDoc(collection(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0], 'Messages'), {
                timeStamp: serverTimestamp(),
                message: message, 
                from: session.user.uid,
                to: router.query.convo[0]
            })
        })

        await setDoc(doc(db, 'Users', router.query.convo[0], 'Conversations', session.user.uid), {
            withPerson: {
                name: session.user.name,
                image: session.user.image
            },
            latestMessage: message,
            timeStamp: serverTimestamp()
        })
        .then(() => {
            addDoc(collection(db, 'Users', router.query.convo[0], 'Conversations', session.user.uid, 'Messages'), {
                timeStamp: serverTimestamp(),
                message: message, 
                from: session.user.uid,
                to: router.query.convo[0]
            })
        })
    }

    return (
        <div className="py-4 overflow-hidden">
            <section className="w-screen bg-gray-900 px-4">
                <div className="flex items-center w-screen">
                    <BiArrowBack className='text-xl text-purple-600 cursor-pointer' onClick={() => router.push('/')}/>
                    <div className="flex space-x-2 items-center ml-4 w-[50%]">
                        <img src={withPerson.image} className="w-12 rounded-full"/>
                        <p className="pl-4 text-2xl text-white">{withPerson.name}</p>
                    </div>
                    <div className="flex space-x-8 justify-end text-xl text-purple-600">
                        <BsFillTelephoneFill className='hover:animate-bounce'/>
                        <FaVideo className='hover:animate-bounce'/>
                        <IoIosInformationCircle className='hover:animate-bounce'/>
                    </div>
                </div>
            </section>


            {/* All messages */}

            <section className="w-full h-[82%] text-white absolute mt-16 overflow-y-scroll flex flex-col space-y-6 py-8 sm:scrollbar-hide">
                {allMessages?.map(message => (
                    <div key={message.id} className="w-screen px-4">
                        {message.data().from === session.user.uid ? (
                            <div className="flex space-x-4 text-2xl items-center ml-32">
                                <img src={session.user.image} className="w-10 rounded-full"/>
                                <p className="w-3/4 bg-blue-500 rounded-2xl py-2 px-3">{message.data().message}</p>
                            </div>
                        ) : (
                            <div className="flex space-x-4 text-2xl items-center">
                                <img src={withPerson.image} className="w-10 rounded-full"/>
                                <p className="w-1/2 bg-gray-700 rounded-2xl px-3 py-2">{message.data().message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>


            <section className="fixed bottom-0 py-4 bg-gray-900 w-screen text-xl text-blue-500 flex items-center">
                <div id='bottomIcons' className="flex w-1/2 space-x-6 pl-4 transition-width ease-in-out duration-200 overflow-x-none">
                    <IoIosAddCircle/>
                    <BsFillCameraFill/>
                    <BsImage/>
                    <FaMicrophone/>
                </div>
                <div id='bottomSearchContainer' className="flex w-1/2 items-center pr-4 transition-width ease-in-out duration-200">
                    <input id='messageInput' type="text" onChange={(e) => setMessage(e.target.value)} className="w-[90%] rounded-xl bg-gray-700 focus:outline-none indent-2 py-1 text-white text-sm transition-width ease-in-out duration-200 pr-7" placeholder="Message" onFocus={handleFocus} onBlur={handleBlur}/>
                    <FaSmile id='messageSmile' className='absolute right-[3rem] transition-right ease-in-out duration-300'/>
                    {message?.length > 0 ? (
                        <LuSendHorizonal id='messageSend' className='ml-4' onClick={handleSend}/>
                    ) : (
                        <HiThumbUp id='messageThumb' className='ml-3'/>
                    )}
                    
                </div>
            </section>
        </div>
    )
}

export default Convo