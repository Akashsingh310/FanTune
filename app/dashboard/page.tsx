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

const creatorId = "ef0ea9db-00f9-42cf-a1a7-2401b5b8a5a9"

export default function Components() {
  return <SongVotingPlatform creatorId = {creatorId} playVideo = {true} />
}