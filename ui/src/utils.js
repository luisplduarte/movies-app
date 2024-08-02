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
