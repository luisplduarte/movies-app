/**
 * Converts a string with amount of minutes into a string with equivalent hours and minutes.
 * @param {number} minutes - string with the amount of minutes.
 * @returns {string} A string formated with hours and minutes.
 */
export function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * If text is bigger than limit chars, it truncates the '...' after the limit chars
 * @param {string} text to be truncated
 * @param {number} limitChars max chars before truncating the string
 * @returns truncated text if length bigger than limit chars or returns same text
 */
export function truncateString(text, limitChars = 70) {
  if (text.length > limitChars) return text.slice(0, limitChars) + '...';
  else return text;
}
