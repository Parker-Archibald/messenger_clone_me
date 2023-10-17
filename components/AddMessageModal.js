import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/Firebase";
import { useEffect, useState } from "react";
import {useSession} from 'next-auth/react'

const AddMessageModal = () => {

    const {data: session} = useSession();
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        if(session) {
            onSnapshot(collection(db, 'Users'), snapshot => {
                let snap = snapshot.docs;
                setAllUsers(snap)
            })
        }
    }, [])

    return(
        <div className="w-[90%] ml-[5%] bg-gray-700 rounded-xl flex flex-col items-left text-black overflow-y-scroll min-h-1/2">
            {allUsers.map(user => {
                return (
                    <div key={user.id} className="flex items-center space-x-6 hover:bg-gray-400 p-4">
                        <img src={user.data().image} className="w-16 h-auto rounded-full"/>
                        <p className="text-2xl text-gray-400">{user.data().name}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default AddMessageModal;