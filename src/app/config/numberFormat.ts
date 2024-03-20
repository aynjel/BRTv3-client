export const numberFormat = (num?: number) => {
  if (!num) return '-';

  const config = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  return Intl.NumberFormat('EN-US', config).format(num);
};
