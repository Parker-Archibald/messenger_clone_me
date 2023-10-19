import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/Firebase";
import { useEffect, useState } from "react";
import {useSession} from 'next-auth/react'
import {useRecoilState} from 'recoil'
import {NewMessageModalState, NewMessageState} from '@/atoms/NewMessageAtom'
import {motion} from 'framer-motion'
import {BiArrowBack} from 'react-icons/bi'
import {HiOutlineUserGroup} from 'react-icons/hi'
import {MessageToState} from '@/atoms/MessageToAtom'

const AddMessageModal = () => {

    const {data: session} = useSession();
    const [allUsers, setAllUsers] = useState([]);
    const [openModal, setOpenModal] = useRecoilState(NewMessageModalState)
    const [newMessage, setNewMessage] = useRecoilState(NewMessageState)
    const [selectedPerson, setSelectedPerson] = useRecoilState(MessageToState)

    useEffect(() => {
        if(session) {
            onSnapshot(collection(db, 'Users'), snapshot => {
                let snap = snapshot.docs;
                setAllUsers(snap)
            })
        }

        if(openModal) {
            document.getElementById('newMessageModal').style.display = 'flex'
            document.getElementById('newMessageSearch').focus()
        }
        else {
            document.getElementById('newMessageModal').style.display = 'none' 
        }

    }, [openModal])

    const handleSelect = (person) => {
        const personData = {
            name: person.data().name,
            id: person.id,
            image: person.data().image
        }

        setSelectedPerson(personData)

        setNewMessage(true)
    }

    return(
        <motion.div 
        initial={{y: 200, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        transition={{duration: .25}}
        id='newMessageModal' className="w-screen bg-gray-900 fixed top-0 h-screen flex-col p-4">
            <section className="sticky w-screen bg-gray-900">
                <div className="flex items-center w-screen">
                    <BiArrowBack className='text-xl text-white'  onClick={() => setOpenModal(false)}/>
                    <p className="pl-4 text-2xl text-white">New Message</p>
                </div>
                <input id='newMessageSearch' type='text' className="mt-4 bg-gray-700 rounded-lg py-1 px-2 text-white focus:outline-none w-[90%]" placeholder="Search Users"/>
                <div className="text-xl text-white flex space-x-4 items-center my-4">
                    <HiOutlineUserGroup className='bg-gray-700 p-1 rounded-full text-3xl'/>
                    <p>Group Message</p>
                </div>
                <p className="my-4 mt-4 ml-1">Suggested Users</p>
            </section>
             <section className="overflow-y-scroll">
                {allUsers.map(user => {
                    if(user.id === session.user.uid) {
                        return
                    }
                    return (
                        <div key={user.id} className="flex items-center space-x-6 hover:bg-gray-700 p-2 mt-6 rounded-md" onClick={() => handleSelect(user)}>
                            <img src={user.data().image} className="w-12 h-auto rounded-full"/>
                            <p className="text-2xl text-gray-400">{user.data().name}</p>
                        </div>
                    )
                })}
             </section>
        </motion.div>
    )
}

export default AddMessageModal;