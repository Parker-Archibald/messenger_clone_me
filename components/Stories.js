'use client'
import { faker } from '@faker-js/faker';
import {useEffect, useState} from 'react';

const Stories = () => {

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        const suggestions = [...Array(20)].map((_, i) => ({
            id: i,
            username: faker.internet.userName(),
            avatar: faker.image.avatar()
        }))

        setSuggestions(suggestions)
    }, [])


    return (
        <div className='w-screen flex space-x-4 overflow-x-scroll p-8 w-[85%] ml-[5%] mt-4'>
            {suggestions?.map(story => {
                return (
                    <div key={story.id} className='shrink-0 px-2 w-20 flex flex-col items-center justify-center'>
                        <img src={story.avatar} className='w-16 h-auto rounded-full'/>
                        <div className='w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center -mt-3 ml-8'>
                            <div className='w-3 h-3 bg-green-400 rounded-full'/>
                        </div>
                        <p className='truncate w-full mt-2 text-center'>{story.username}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Stories;