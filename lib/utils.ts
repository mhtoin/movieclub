import { isServer } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type ArgValCallback<T> = (arg0: T) => any;

export const omit = (obj: any, keys: string[]) => {
  const result = { ...obj };
  keys.forEach((key) => result.hasOwnProperty(key) && delete result[key]);
  return result;
};

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sample = (arr: any[], withShuffle: boolean) => {
  if (withShuffle) {
    arr = shuffle(arr);
  }
  const len = arr == null ? 0 : arr.length;
  return len ? arr[Math.floor(Math.random() * len)] : undefined;
};

export const range = (length: number) => {
  return Array.from({ length: length }, (_, i) => i);
};

export const orderBy = (arr: any[], key: string, order: string) => {
  return arr.reduce((r, a) => {
    //
    r[a.user.name] = [...(r[a?.user?.name] || []), a?.movie];
    return r;
  }, {});
};

export const groupBy = (arr: any[], cb: (arg0: unknown) => any) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    r[key] = [...(r[key] || []), a];
    return r;
  }, {});
};

export const keyBy = (arr: any[], cb: (arg0: unknown) => any) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    //r[key] = {...(r[key] || {}), a};
    return { ...r, [key]: a };
  }, {});
};

/**
 * Sorts collection into groups and returns  collection with the count of items of each group
 * @param arr collection to sort
 * @param cb  callback function to get the key to sort by
 * @returns sorted collection
 */
export const countByKey = (arr: any[], cb: ArgValCallback<any>) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    r[key] = (r[key] || 0) + 1;
    return r;
  }, {});
};

export function getBaseURL() {
  if (!isServer) {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortByISODate(a: any, b: any, direction: "asc" | "desc") {
  return direction === "asc" ? a.localeCompare(b) : -a.localeCompare(b);
}

export function sendShortlistUpdate(userId: string) {
  "use client";
  console.log("sending shortlist update", userId);
  publishMessage({ queryKey: ["shortlists"] }, "shortlist", userId);
}

export async function publishMessage(
  message: string | object,
  topic: string,
  user_id: string
) {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : process.env.NEXT_PUBLIC_RELAY_URL
    }/publish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        topic: topic,
        user_id: user_id,
      }),
    }
  );
}

export async function sendNotification(
  message: string | object,
  user_id: string
) {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : process.env.NEXT_PUBLIC_RELAY_URL
    }/publish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        topic: "shortlist",
        user_id: user_id,
      }),
    }
  );
}

export async function getBlurDataUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error generating blur data URL:", error);
    return ""; // Return empty string as fallback
  }
}
