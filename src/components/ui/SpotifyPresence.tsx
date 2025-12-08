import { useEffect, useState } from 'react'
import { FaSpotify } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'

interface Track {
  name: string
  artist: { '#text': string }
  album: { '#text': string }
  image: { '#text': string }[]
  url: string
  '@attr'?: { nowplaying: string }
}

const SpotifyPresence = () => {
  const [displayData, setDisplayData] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('https://lastfm-last-played.biancarosa.com.br/rishblol/latest-song')
      .then((response) => response.json())
      .then((data) => {
        setDisplayData(data.track)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching latest song:', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full flex-col gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 flex-shrink-0 rounded-xl" />
          <div className="flex flex-col justify-center gap-3 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    )
  }

  if (!displayData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No recent tracks found</p>
      </div>
    )
  }

  const { name: song, artist, album, image, url } = displayData
  const isNowPlaying = displayData['@attr']?.nowplaying === 'true'

  return (
    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaSpotify className={`text-2xl ${isNowPlaying ? 'text-green-500' : 'text-emerald-400'}`} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-emerald-400">
              {isNowPlaying ? 'Now Playing' : 'Last Played'}
            </span>

          </div>
          {isNowPlaying && (
            <span className="relative flex h-2 w-2 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors p-1.5 rounded-md hover:bg-emerald-500/10"
          title="View on Last.fm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Album Art & Track Info */}
      <div className="flex gap-5 flex-1">
        <div className="relative group flex-shrink-0">
          <img
            src={image[3]['#text']}
            alt={`${album['#text']} album art`}
            width={140}
            height={140}
            className="rounded-lg shadow-lg border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xl font-bold text-white hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-tight"
          >
            {song}
          </a>
          <div className="space-y-1">
            <p className="text-sm text-gray-300 line-clamp-1">
              <span className="text-gray-500">by</span>{' '}
              <span className="font-medium">{artist['#text']}</span>
            </p>
            <p className="text-sm text-gray-400 line-clamp-1">
              <span className="text-gray-500">on</span>{' '}
              <span className="font-medium">{album['#text']}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotifyPresence
