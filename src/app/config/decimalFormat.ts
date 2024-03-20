export const decimalFormat = (num?: number) => {
  if (!num) return '-';

  const config = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  return Intl.NumberFormat('EN-US', config).format(num);
};
