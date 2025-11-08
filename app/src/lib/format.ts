export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    // Use fixed format to avoid hydration mismatch
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (_err) {
    return '-';
  }
}
