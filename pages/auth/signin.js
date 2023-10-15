import {getProviders, signIn as SignIntoProvider} from 'next-auth/react'
import { useEffect } from 'react'
import {FcGoogle} from 'react-icons/fc'


const signin = ({providers}) => {

    useEffect(() => {
    }, [])


    return (
        <div className='flex items-center justify-center w-screen h-screen'>
            <div className='w-3/4 border border-gray-400 rounded-lg py-4'>
                {Object.values(providers).map(provider => (
                    <div key={provider.name} className='items-center flex flex-col' onClick={() => SignIntoProvider(provider.id, {callbackUrl: '/'})}>
                        <FcGoogle id='googleIcon' className='text-6xl my-4 animate-bounce'/>
                        <p>
                            Sign in with {provider.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {providers: providers}
    }
}

export default signin;