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
 * If text is bigger than 70 caracteres, it truncates the '...' after the 70 caracteres
 * @param {string} text to be truncated
 * @returns truncated text if length bigger than 70 or returns same text
 */
export function truncateString(text) {
  if (text.length > 70) return text.slice(0, 70) + '...';
  else return text;
}
