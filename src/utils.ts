export function getDate(dateString: string): Date {
  const month = Number(dateString.split('/').shift());
  const year = Number(dateString.split('/').pop());
  return new Date(year, month);
}
