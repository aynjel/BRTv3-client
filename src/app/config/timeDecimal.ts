export const convertToTimeDecimal = (time?: number): string => {
  if (!time) return '-';

  const hours = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60).toString().padStart(2, '0');

  return `${hours} hr, ${mins} min`;
  // if (time instanceof Date) {
  //   const hour = time.getHours();
  //   const min = time.getMinutes();

  //   return hour + (min / 60) + '';
  // }

  // const timeSplit = (time as string).split(':');
  // if (!timeSplit.length) return '-';

  // const hour = Number(timeSplit[0]);
  // const min = Number(timeSplit[1]);

  // return hour + (min / 60) + '';
};
