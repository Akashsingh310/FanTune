'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Share2, Music } from 'lucide-react'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { YT_REGEX } from "@/app/lib/utils";
import { randomUUID } from 'crypto'
import { toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SongVotingPlatform from '../components/SongVotingPlatform'


interface item {
    "id": string,
    "type": string,
    "url": string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "votes": number,
    "haveUpvoted": boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

const creatorId = "60c6befc-c591-49a6-912a-23a984f54037"

export default function Components() {
  return <SongVotingPlatform creatorId = {creatorId}/>
}