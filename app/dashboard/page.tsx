'use client'


import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import SongVotingPlatform from '../components/SongVotingPlatform'



const creatorId = "ef0ea9db-00f9-42cf-a1a7-2401b5b8a5a9"

export default function Components() {
  return <SongVotingPlatform creatorId = {creatorId} playVideo = {true} />
}