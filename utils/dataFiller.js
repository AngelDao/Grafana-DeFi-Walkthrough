const dataFiller = (arr) => {
  arr.forEach((obj) => {
    const len = obj.datapoints.length;
    const lastPoint = obj.datapoints[len - 1];
    const [value, date] = lastPoint;
    const lastDate = new Date(date);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - lastDate.getTime();
    const daysBetween = Math.floor(timeDiff / 86400000);
    let i;
    const timeIter = timeDiff / daysBetween;
    let contTime = lastDate.getTime();
    if (daysBetween > 0) {
      do {
        const time = contTime + timeIter;
        obj.datapoints.push([value, time]);
        contTime += timeIter;
        i++;
      } while (i < daysBetween);
      obj.datapoints.push([value, currentDate.getTime()]);
    }
  });
  return arr;
};

module.exports = dataFiller;
