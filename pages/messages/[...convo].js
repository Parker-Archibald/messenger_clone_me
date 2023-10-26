import { useRecoilState } from "recoil"
import {SelectedMessageState} from '@/atoms/SelectedMessageAtom'
import { useEffect, useState } from "react"
import {collection, doc, onSnapshot, orderBy, query} from 'firebase/firestore'
import {db} from '@/firebase'
import {useSession} from 'next-auth/react'
import { useRouter } from "next/router"

const Convo = () => {
    
    // const [selectedMessage, setSelectedMessage] = useRecoilState(SelectedMessageState)
    const {data: session} = useSession()
    const [allMessages, setAllMessages] = useState([])
    const [withPerson, setWithPerson] = useState([])
    const router = useRouter()

    useEffect(() => {
        if(session) {
            onSnapshot(doc(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0]), snapShot => {
                setWithPerson(snapShot.data().withPerson)
            })

            onSnapshot(query(collection(db, 'Users', session.user.uid, 'Conversations', router.query.convo[0], 'Messages')), snapShot => {
                let snap = snapShot.docs
                setAllMessages(snap)
            })
            
        }
    }, [session])

    return (
        <div>
            {allMessages?.map(message => (
                <div key={message.id}>
                    <img src={withPerson.image}/>
                </div>
            ))}
        </div>
    )
}

export default Convo