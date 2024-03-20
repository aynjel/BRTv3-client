export const currencyFormat = (num?: number) => {
  if (!num) return '-';

  const config = {
    style: 'currency',
    currency: 'PHP'
  };

  return Intl.NumberFormat('EN-US', config).format(num);
};
