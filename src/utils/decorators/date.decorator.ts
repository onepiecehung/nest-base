import {
  endOfWeek,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';

export function getDates(fromDate: Date, toDate: Date, step = 1): Date[] {
  const dates = [];
  let currentDate = fromDate;
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= toDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, step);
  }
  return dates;
}

export function getStartDayAndEndDay(date: Date): Date[] {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return [start, end];
}

export function getStartWeekAndEndWeek(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });

  const end = endOfWeek(date, { weekStartsOn: 1 });

  return [start, end];
}

export function getStartMonthAndEndMonth(date: Date): Date[] {
  const start = startOfMonth(date);

  const end = endOfMonth(date);

  return [start, end];
}

export function getStartYearAndEndYear(date: Date): Date[] {
  const start = startOfYear(date);

  const end = endOfYear(date);

  return [start, end];
}
