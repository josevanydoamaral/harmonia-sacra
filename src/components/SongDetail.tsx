import React from 'react'
import TrackControl from './TrackControl'

const SongDetail = () => {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      <div className="w-full lg:w-1/2">
        <iframe 
          className='bg-white'
          src="https://example.org"
          title='Canticos'
          width={600}
          height={700}
          >

        </iframe>
      </div>
      <div className="w-full lg:w-1/2 p-6">
        <TrackControl/>
      </div>
      
    </div>
  )
}

export default SongDetail