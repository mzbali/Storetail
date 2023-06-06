export const getCookie = (name: string): string | null => {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

export const currencyFormat = (price: number) => '£' + (price / 100).toFixed(2);
