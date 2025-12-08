'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { type FunctionComponent, useCallback, useEffect, useState, cloneElement } from 'react'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
  username: string
}

async function fetchCalendarData(username: string): Promise<ApiResponse> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
  )
  const data: ApiResponse | ApiErrorResponse = await response.json()

  if (!response.ok) {
    throw Error(
      `Fetching GitHub contribution data for "${username}" failed: ${
        (data as ApiErrorResponse).error
      }`,
    )
  }

  return data as ApiResponse
}

const GithubCalendar: FunctionComponent<Props> = ({ username, ...props }) => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchCalendarData(username)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [username])

  useEffect(fetchData, [fetchData])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src="/static/images/-discord-futon.svg"
          alt="Error"
          width={0}
          height={0}
          className="lg:w-48 h-auto w-24"
        />
        <p className="lg:w-64 w-48 text-center text-sm text-muted-foreground">
          This component is down
        </p>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const yearlyTotal = data.total[currentYear] || 0
  const recentContributions = selectLastNDays(data.contributions, 300)
  const recentTotal = recentContributions.reduce((sum, day) => sum + day.count, 0)
  const avgPerDay = (recentTotal / 198).toFixed(1)
  const maxStreak = calculateStreak(data.contributions)

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">GitHub Activity</h3>
            <p className="text-sm text-gray-500">@{username}</p>
          </div>
        </div>
        
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors p-1.5 rounded-md hover:bg-emerald-500/10"
          title="View GitHub Profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Calendar - Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <Calendar
          data={selectLastNDays(data.contributions, 198)}
          theme={{
            dark: ['#0f1419', '#0d4a2d', '#10b981', '#34d399', '#6ee7b7'],
          }}
          colorScheme="dark"
          blockSize={18}
          blockMargin={5}
          blockRadius={4}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
          labels={{
            totalCount: '{{count}} contributions in the last half year',
          }}
        />
      </div>

      {/* Calendar - Mobile */}
      <div className="sm:hidden overflow-x-auto">
        <Calendar
          data={selectLastNDays(data.contributions, 60)}
          theme={{
            dark: ['#0f1419', '#0d4a2d', '#10b981', '#34d399', '#6ee7b7'],
          }}
          colorScheme="dark"
          blockSize={14}
          blockMargin={4}
          blockRadius={3}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
    </div>
  )
}

interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<Activity>
}

interface ApiErrorResponse {
  error: string
}

const selectLastNDays = (contributions: Activity[], days: number) => {
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)
  startDate.setHours(0, 0, 0, 0) // Start of the day

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= startDate && activityDate <= today
  })
}

const calculateStreak = (contributions: Activity[]) => {
  let maxStreak = 0
  let currentStreak = 0

  for (const activity of contributions) {
    if (activity.count > 0) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

export default GithubCalendar