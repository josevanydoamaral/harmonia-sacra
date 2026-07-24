export function formatTime(seconds:number) {
    if (!seconds || isNaN(seconds)) return "00:00" 
  const formattedMinutes = 
    Math.trunc(seconds / 60).toString().padStart(2, '0')
    +':'+
    Math.trunc(seconds % 60).toString().padStart(2, '0');
  
  return formattedMinutes

}