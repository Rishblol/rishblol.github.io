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
      <div className="relative flex h-full w-full flex-col justify-between rounded-3xl p-6">
        <Skeleton className="mb-2 h-[55%] w-[55%] rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="absolute right-0 top-0 m-3 text-primary">
          <FaSpotify size={56} />
        </div>
      </div>
    )
  }

  if (!displayData) return <p>Something absolutely horrible has gone wrong</p>

  const { name: song, artist, album, image } = displayData
  const isNowPlaying = displayData['@attr']?.nowplaying === 'true'

  return (
    <div className="relative flex flex-col md:flex-row gap-4 p-6">
      <img
        src={image[3]['#text']}
        alt="Album art"
        width={128}
        height={128}
        className="rounded-xl border border-border grayscale"
      />
      <div className="flex flex-col justify-between">
        <div className="flex items-center gap-2 text-sm text-primary">
          <FaSpotify />
          <span>{isNowPlaying ? 'Now playing...' : 'Last played...'}</span>
        </div>
        <div className="mt-2">
          <p className="font-bold text-lg leading-tight">{song}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-secondary-foreground">by</span>{' '}
            {artist['#text']}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-secondary-foreground">on</span>{' '}
            {album['#text']}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SpotifyPresence
