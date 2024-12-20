'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Share2 } from 'lucide-react'
import axios from 'axios'

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function SongVotingPlatform() {
  const [videoLink, setVideoLink] = useState('')
  const [queue, setQueue] = useState([
    { id: '1', title: 'Song 1', votes: 5, thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: '2', title: 'Song 2', votes: 3, thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: '3', title: 'Song 3', votes: 1, thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' },
  ])
  const [currentVideo, setCurrentVideo] = useState('dQw4w9WgXcQ')

  async function refreshstream()
  {
    const res = await fetch(`api/streams/my`,{
      credentials:"include"
    });
    // console.log(res);
  }
  useEffect(()=>{
    refreshstream()
    const interval = setInterval(()=>{

    },REFRESH_INTERVAL_MS)
  },[])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', videoLink);
    setVideoLink('');
  }

  const handleVote = (id: string, increment: number) => {
    setQueue(queue.map(item => 
      item.id === id ? { ...item, votes: item.votes + increment } : item
    ).sort((a, b) => b.votes - a.votes))
  }

  const handleShare = (id: string) => {
    const shareableLink = `https://yoursongvotingplatform.com/song/${id}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  }

  const handleSharePlatform = () => {
    const shareableLink = 'https://yoursongvotingplatform.com';
    navigator.clipboard.writeText(shareableLink);
    alert('Platform link copied to clipboard!');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Song Voting Platform</h1>
        <Button 
          onClick={handleSharePlatform}
          className="mb-8 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Current Song</h2>
            <div className="aspect-video mb-4">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${currentVideo}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Add a Song</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="flex-grow bg-gray-800 text-white border-gray-700"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add to Queue</Button>
            </form>

            {videoLink && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Preview:</h3>
                <img 
                  src={`https://img.youtube.com/vi/${videoLink.split('v=')[1]}/0.jpg`} 
                  alt="Video thumbnail" 
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Songs</h2>
            <div className="space-y-4">
              {queue.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="flex items-center p-4">
                    <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVote(item.id, 1)}
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        >
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          {item.votes}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVote(item.id, -1)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                        >
                          <ThumbsDown className="mr-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentVideo(item.id)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleShare(item.id)}
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 ml-2"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
