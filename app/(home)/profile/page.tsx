'use client'

import { Button } from 'components/ui/Button'
import { useGetTMDBSession, useValidateSession } from 'lib/hooks'
import { useEffect, useState } from 'react'
import { useTransition } from 'react'
import { saveProfile } from './actions/action'

export default function Profile() {
  const [_isPending, startTransition] = useTransition()
  const { data: session, status } = useValidateSession()
  const [sessionId, setSessionId] = useState(session?.sessionId)
  const [accountId, setAccountId] = useState(session?.accountId)
  const [notification, _setNotification] = useState('')

  useEffect(() => {
    if (session?.sessionId) {
      setSessionId(session?.sessionId)
    }

    setAccountId(session?.accountId)
  }, [session])
  useGetTMDBSession(session?.id || '', setSessionId, (value: string) =>
    setAccountId(value ? Number.parseInt(value) : null),
  )

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <span className="loading loading-spinner text-success" />
      </div>
    )
  }

  if (status === 'error') {
    return <p>Access Denied</p>
  }

  const handleClick = async () => {
    const res = await fetch(
      'https://api.themoviedb.org/3/authentication/token/new',
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      },
    )

    const { success, request_token } = await res.json()

    if (success && request_token) {
      const redirectUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://movieclub-seven.vercel.app'
      window.location.href = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${redirectUrl}/profile`
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {notification && (
        <div className="alert alert-success max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Success</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{notification}</span>
        </div>
      )}
      <div>Welcome {session?.name}</div>
      <details className="collapse-arrow border-base-300 bg-base-200 collapse max-w-sm border">
        <summary className="collapse-title text-xl font-medium">
          TMDB Account Settings
        </summary>
        <div className="collapse-content flex flex-col items-center gap-5">
          <Button onClick={handleClick} disabled={!sessionId || !accountId}>
            Link TMDB account
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Link TMDB account</title>
              <g fill="none">
                <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                <path
                  fill="currentColor"
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9.5a3.625 3.625 0 0 1 1.348 6.99a.837.837 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5Z"
                />
              </g>
            </svg>
          </Button>
          <input
            type="text"
            placeholder="TMDB Account ID - link by pressing the above button"
            className="input input-bordered max-w-xs"
            value={accountId ? accountId.toString() : 'No valid Account Id'}
            readOnly
          />
          <input
            type="text"
            placeholder="Approved TMDB Session Id"
            className="input input-bordered w-full max-w-xs"
            value={sessionId ? sessionId.toString() : 'No valid id'}
            readOnly
          />
        </div>
      </details>
      <Button
        onClick={() =>
          startTransition(() => {
            if (sessionId && accountId) {
              saveProfile(session)
            }
          })
        }
      >
        Save
      </Button>
    </div>
  )
}
