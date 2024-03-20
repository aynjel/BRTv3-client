export const generateRandomNumber = (min: number, max: number) => {
  if (!min && !max) return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  if (!!min && !max) return Math.floor(Math.random() * min);
  if (!min && !!max) return Math.floor(Math.random() * max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const now = new Date().getTime();
const timeDifference = Math.floor(Math.random() * 2 * 60 * 60 * 1000);

export const generateRandomTime = () => new Date(Math.floor(now - timeDifference)).toISOString();
