'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircleChevronUp, CircleChevronDown, Play, Share2, Music } from 'lucide-react'
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { YT_REGEX } from "@/app/lib/utils";
import { toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @ts-expect-error: No TypeScript type definition for youtube-player module
import YouTubePlayer, { YouTubePlayerEvent }  from 'youtube-player';

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


export default function SongVotingPlatform({
  creatorId,
  playVideo = false
}:{
  creatorId: string;
  playVideo: boolean;
}) {
  const [videoLink, setVideoLink] = useState('')
  const [queue, setQueue] = useState<item[]>([])
  const [currentVideo, setCurrentVideo] = useState<item | null>(null)
  const [loading,setLoading] = useState(false);
  const [playNextLoader, setplayNextLoader] = useState(false)
  const session = useSession()
  const router = useRouter()
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);


  async function refreshStream() {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, { 
      credentials: "include" 
    });
    const data = await res.json();
    setQueue(data?.streams?.sort((a: item, b: item) => b.votes - a.votes) || []);
    setCurrentVideo(item => {
      if(item?.id === data.activeStream?.stream?.id)
      {
        return item
      }
      return data.activeStream.stream
    });
  }

  useEffect(() => {
    refreshStream()
    const interval = setInterval(() => {
      refreshStream()
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/') // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(()=>{
    if(!videoPlayerRef.current){
      return;
    }
    const player = YouTubePlayer(videoPlayerRef.current);
    player.loadVideoById(currentVideo?.extractedId);
    player.playVideo();
    function evenHandler(event:YouTubePlayerEvent)
    {
      // console.log(event);
      // console.log(event.data);
      if(event.data === 0){
          handlePlayNext();
        }
    };
    player.on('stateChange',evenHandler);
    return ()=>{
      player.destroy();
    }
  },[currentVideo,videoPlayerRef])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
        method: "POST",
        body: JSON.stringify({
          creatorId: creatorId,
          url: videoLink
        })
      });
      if (res.ok) {
        setLoading(false)
        setVideoLink('');
      } else {
        console.error("Failed to add stream");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(queue.map(item => 
      item.id === id ? 
      { 
        ...item, 
        votes: isUpvote ? item.votes + 1 : item.votes-1,
        haveUpvoted: !item.haveUpvoted
      } 
      : item
    ).sort((a, b) => (b.votes) - (a.votes)))

    fetch(`api/streams/${isUpvote ? "upvote" : "downvote"}`,{
      method:"POST",
      body: JSON.stringify({
        streamId:id
      })
    })
  }

  const handleSharePlatform = () => {
    const shareableLink = `${window.location.origin}/creator/${creatorId}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast.success('Platform link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: '#4CAF50', 
            color: '#fff', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            padding: '10px 20px', 
          }
        });
      })
      .catch((error) => {
        toast.error('Failed to copy link to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: '#f44336', 
            color: '#fff', 
            borderRadius: '8px',
            fontWeight: 'bold',
            padding: '10px 20px',
          }
        });
        console.error("Clipboard error: ", error);
      });
  };

  const handlePlayNext = async () => {
    if (queue.length === 0) {
      toast.info('No upcoming songs in the queue!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try{
        setplayNextLoader(true)
        const data = await fetch('/api/streams/next',{
        method:"GET"
      })
      const json =  await data.json();
      setCurrentVideo(json.stream);
      setQueue(q=>q.filter(x=>x.id !== json.stream.id))
    } 
    catch(e){
      console.log(e)
    }
    setplayNextLoader(false)
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <header className="p-4 flex justify-between items-center bg-black">
        <div className="flex items-center">
          <Music className="h-6 w-6 mr-2 text-indigo-400" />
          <span className="font-bold text-xl text-white">FanTune</span>
        </div>
        <div>
          {session.data?.user ? (
            <button 
              className="p-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button 
              className="p-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Song Voting Platform</h1>
        <Button 
          onClick={handleSharePlatform}
          className="mb-8 bg-purple-600 hover:bg-purple-700 text-white">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <ToastContainer />

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Current Song</h2>
            <div className="aspect-video mb-4">
              {/* {currentVideo && playVideo &&(
                <div ref={videoPlayerRef} className='w-full'/>
                
                // <iframe 
                //   width="100%" 
                //   height="100%" 
                //   src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                //   allowFullScreen
                // ></iframe>
              )} */}
              {currentVideo ? (
                    <div>
                      {playVideo ? (
                        <>
                          <div ref={videoPlayerRef} className="w-full" />
                        </>
                      ) : (
                        <>
                          <img
                            height={300}
                            width={300}
                            alt={currentVideo.bigImg}
                            src={currentVideo.bigImg}
                            className="h-84 w-full rounded object-cover"
                          />
                          <p className="mt-2 text-center font-semibold">
                            {currentVideo.title}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="py-8 text-center">No video playing</p>
                  )}
            </div>


            {playVideo && <Button disabled={playNextLoader}
              onClick={handlePlayNext}
              className="p-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {playNextLoader ? "Loading..." : "Play Next"}
            </Button>}

            <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Add a Song</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="flex-grow bg-gray-800 text-white border-gray-700"
              />
              <Button disabled = {loading}
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
              >{loading ? "loading..." : "Add to Queue"}</Button>
            </form>

            {videoLink && videoLink.match(YT_REGEX) && !loading &&(
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Preview:</h3>
                  <LiteYouTubeEmbed
                    title="Video Preview"
                    id={videoLink.split("?v=")[1]}
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
                    <img src={item.smallImg} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
                    <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <div className="flex items-center mt-1">
                      <Button 
                        // variant="ghost" 
                        size="sm" 
                        onClick={() => handleVote(item.id, item.haveUpvoted ? false : true)} // Toggle upvote state
                        // className={`${
                        //   item.haveUpvoted 
                        //     ? "text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                        //     : "text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        // }`}
                      >
                        {item.haveUpvoted 
                          ? <CircleChevronDown className="mr-1 h-4 w-4" /> 
                          : <CircleChevronUp className="mr-1 h-4 w-4" />}
                        {item.votes ?? 0} 
                      </Button>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentVideo(item)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    >
                      <Play className="h-4 w-4" />
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