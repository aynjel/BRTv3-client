const gradient = 200;

export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * gradient) + 1;
  const g = Math.floor(Math.random() * gradient) + 1;
  const b = Math.floor(Math.random() * gradient) + 1;

  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};
