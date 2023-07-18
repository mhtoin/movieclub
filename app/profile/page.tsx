"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { saveProfile } from "./actions/action";
import { useTransition } from "react";

export default function Profile() {
  let [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const [sessionId, setSessionId] = useState(session?.user.sessionId);
  const [accountId, setAccountId] = useState(session?.user.accountId);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setSessionId(session?.user.sessionId)
    setAccountId(session?.user.accountId)
  }, [session])

  useEffect(() => {
    const loc = window.location.search;

    if (loc) {
      let locParts = loc ? loc.split("&") : "";

      if (locParts && locParts.length > 1) {
        let token = locParts[0].split("=")[1];
        
        let approved = locParts[1] === "approved=true";
     

        if (approved) {
          let authenticationCallback = `https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.NEXT_PUBLIC_MOVIEDB_KEY}&request_token=${token}`;

          let getSessionId = async () => {
            let res = await fetch(authenticationCallback);

            if (res.ok) {
              let id = await res.json();
              setSessionId(id.session_id);

              // finally, fetch the account id
              let accountRes = await fetch(
                `https://api.themoviedb.org/3/account?api_key=${process.env.NEXT_PUBLIC_MOVIEDB_KEY}&session_id=${id.session_id}`
              );

              let accountBody = await accountRes.json();

              setAccountId(accountBody.id);
              setNotification(
                "You need to log out and log back in for the changes to take effect"
              );
              setTimeout(() => {
                setNotification("");
              }, 5000);
            }
           
          };

          getSessionId();
        }
      }
    }
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <span className="loading loading-spinner text-success"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  const handleClick = async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/authentication/token/new",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.moviedbtoken}`,
        },
      }
    );

    const { success, request_token } = await res.json();

    if (success && request_token) {
      //
      window.location.href = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=http://localhost:3000/profile`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {notification && (
        <div className="alert alert-success max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
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
      <div>Welcome {session?.user.name}</div>
      <details className="collapse collapse-arrow border border-base-300 bg-base-200 max-w-sm">
        <summary className="collapse-title text-xl font-medium">
          TMDB Account Settings
        </summary>
        <div className="collapse-content flex flex-col items-center gap-5">
          <button
            className="btn btn-success"
            onClick={handleClick}
            disabled={sessionId && accountId}
          >
            Link TMDB account
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                <path
                  fill="currentColor"
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9.5a3.625 3.625 0 0 1 1.348 6.99a.837.837 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5Z"
                />
              </g>
            </svg>
          </button>
          <input
            type="text"
            placeholder="TMDB Account ID"
            className="input input-bordered max-w-xs"
            value={accountId ? accountId : "No valid Account Id"}
            readOnly
          />
          <input
            type="text"
            placeholder="Approved TMDB Session Id"
            className="input input-bordered w-full max-w-xs"
            value={sessionId ? sessionId : "No valid id"}
            readOnly
          />
        </div>
      </details>
      <div
        className="btn"
        onClick={() =>
          startTransition(() =>
            saveProfile({
              sessionId: sessionId,
              accountId: parseInt(accountId),
            } as User)
          )
        }
      >
        Save
      </div>
    </div>
  );
}
