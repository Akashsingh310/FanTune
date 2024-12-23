'use client'


import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import SongVotingPlatform from '../components/SongVotingPlatform'



const creatorId = "962b4598-2104-46da-a03a-be91247a37a5"

export default function Components() {
  return <SongVotingPlatform creatorId = {creatorId} playVideo = {true} />
}
