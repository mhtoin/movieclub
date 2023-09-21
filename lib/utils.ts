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
}

export const groupBy = (arr: any[], cb: (arg0: unknown) => any) => {
    return arr.reduce((r, a) => {
        let key = cb(a);
        r[key] = [...(r[key] || []), a];
        return r;
    }, {});
}

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
}