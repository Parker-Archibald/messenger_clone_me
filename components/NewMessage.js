import { NewMessageState } from "@/atoms/NewMessageAtom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {motion} from 'framer-motion'
import { MessageToState } from "@/atoms/MessageToAtom";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineUserGroup, HiThumbUp } from "react-icons/hi";
import { NewMessageModalState } from "@/atoms/NewMessageAtom";
import {BsFillTelephoneFill, BsFillCameraFill, BsImage} from 'react-icons/bs'
import {FaMicrophone, FaSmile, FaVideo} from 'react-icons/fa'
import {IoIosInformationCircle, IoIosAddCircle} from 'react-icons/io'
import {LuSendHorizonal} from 'react-icons/lu'
import { onSnapshot, doc, collection, addDoc, setDoc, serverTimestamp, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/Firebase";
import {useSession} from 'next-auth/react'

const NewMessage = () => {

    const [isOpen, setIsOpen] = useRecoilState(NewMessageState)
    const [toPerson, setToPerson] = useRecoilState(MessageToState)
    const [newMessageModal, setNewMessageModal] = useRecoilState(NewMessageModalState)
    const [message, setMessage] = useState('')
    const {data: session} = useSession()
    const [allMessages, setAllMessages] = useState([])

    useEffect(() => {
        if(isOpen) {
            document.getElementById('newMessageContainer').style.display = 'flex'
        }
        else {
            document.getElementById('newMessageContainer').style.display = 'none'
        }
    }, [isOpen])

    useEffect(() => {
        if(isOpen) {
            getMessages()
        }
    }, [isOpen])

    const getMessages = async () => {
        onSnapshot(query(collection(db, 'Users', session.user.uid, 'Conversations', toPerson.id, 'Messages'), orderBy('timeStamp', 'asc')), snapShot => {
            let snap = snapShot.docs;
            setAllMessages(snap)
        })
        
    }

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
        
        await setDoc(doc(db, 'Users', session.user.uid, 'Conversations', toPerson.id), {
            withPerson: {
                name: toPerson.name,
                image: toPerson.image
            },
            latestMessage: message,
            timeStamp: serverTimestamp()
        })
        .then(() => {
            addDoc(collection(db, 'Users', session.user.uid, 'Conversations', toPerson.id, 'Messages'), {
                timeStamp: serverTimestamp(),
                message: message, 
                from: session.user.uid,
                to: toPerson.id
            })
        })

        await setDoc(doc(db, 'Users', toPerson.id, 'Conversations', session.user.uid), {
            withPerson: {
                name: session.user.name,
                image: session.user.image
            },
            latestMessage: message,
            timeStamp: serverTimestamp()
        })
        .then(() => {
            addDoc(collection(db, 'Users', toPerson.id, 'Conversations', session.user.uid, 'Messages'), {
                timeStamp: serverTimestamp(),
                message: message, 
                from: session.user.uid,
                to: toPerson.id
            })
        })
    }

return (
    <motion.div
    initial={{x: 250}}
    whileInView={{x: 0}}
    transition={{duration: .25}}
    id='newMessageContainer' className="w-screen h-screen bg-gray-900 fixed top-0 hidden py-4">
        <section className="w-screen bg-gray-900 px-4">
            <div className="flex items-center w-screen">
                <BiArrowBack className='text-xl text-purple-600'  onClick={() => {setIsOpen(false), setNewMessageModal(false)}}/>
                <div className="flex space-x-2 items-center ml-4 w-[50%]">
                    <img src={toPerson.image} className="w-12 rounded-full"/>
                    <p className="pl-4 text-2xl text-white">{toPerson.name}</p>
                </div>
                <div className="flex space-x-8 justify-end text-xl text-purple-600">
                    <BsFillTelephoneFill className='hover:animate-bounce'/>
                    <FaVideo className='hover:animate-bounce'/>
                    <IoIosInformationCircle className='hover:animate-bounce'/>
                </div>
            </div>
        </section>

        {/* All messages */}

        <section className="w-full h-[82%] text-white absolute mt-16 overflow-y-scroll flex flex-col space-y-6 py-8">
            {allMessages?.map(message => (
                <div key={message.id} className="w-screen px-4">
                    {message.data().from === session.user.uid ? (
                        <div className="flex space-x-4 text-2xl items-center ml-32">
                            <img src={session.user.image} className="w-10 rounded-full"/>
                            <p className="w-3/4 bg-blue-500 rounded-2xl py-2 px-3">{message.data().message}</p>
                        </div>
                    ) : (
                        <div className="flex space-x-4 text-2xl items-center">
                            <img src={toPerson.image} className="w-10 rounded-full"/>
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
                {message.length > 0 ? (
                    <LuSendHorizonal id='messageSend' className='ml-4' onClick={handleSend}/>
                ) : (
                    <HiThumbUp id='messageThumb' className='ml-3'/>
                )}
                
            </div>
        </section>
    </motion.div>
)

}

export default NewMessage;