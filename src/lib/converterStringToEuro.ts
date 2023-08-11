export const converterStringToEuro = (item: string) => {
  const number = Number(item);

  if (isNaN(number)) {
    return null;
  }

  return (number / 100).toFixed(2);
};
