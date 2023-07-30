export const secondToMin = (second) => {
  let min = Math.floor(second / 60);
  let sec = Math.floor(second % 60);
  let hour = Math.floor(min / 60);
  if (hour === 0) {
    if (min < 10) {
      min = `0${min}`;
    }
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min}:${sec}`;
  }

  return `${hour}:${min}:${sec}`;
};
