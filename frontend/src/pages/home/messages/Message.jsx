import React from 'react'

const Message = () => {
  return (
    <div className='chat chat-end '> 
    <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
            <img
            alt='Tailwind CSS chat bubble component'
            src={"https://th.bing.com/th/id/R.3aae1a6e9a03f329351bce8db85e2f76?rik=eMiQ92hfy0YR%2bg&pid=ImgRaw&r=0"}
            />
            
        </div>
    </div>
    <div className={'chat-bubble text-white bg-blue-500'}>Hi! What is up?</div>
    <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12:42</div>
    </div>
  )
}

export default Message
