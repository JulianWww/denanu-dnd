enum DurationTypes {
  Rounds,
  Seconds,
  LongRest,
  ShortRest,
}

export interface TimeData {
  duration: number;
  duration_type: number;
}

export const spellDurations = [
  "Instantaneous",
  "Time",
  "Rounds",
  "Special",
  "Until dispelled",
]

export function renderTime(data?: TimeData) {
  if (!data) return null;
  if (data.duration_type === 2) return data.duration.toString() + " " + (data.duration < 2 ? "round" : "rounds")
  if (data.duration_type === 1) return sformat(data.duration)
  return spellDurations[data.duration_type]
}

interface SplitTime {
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function splitTime(s: number) : SplitTime  {
  return {
      day: Math.floor(s / 86400),
      hour: Math.floor(s / 3600) % 24,
      minute: Math.floor(s / 60) % 60,
      second: s % 60,
  };
}

export function combineTimes(times: SplitTime) {
  return times.day * 86400 + times.hour * 3600 + times.minute * 60 + times.second
}

function sformat(s: number) {
  const split = splitTime(s)
  var fm = [
        [split.day, "day", "days"],
        [split.hour, "hour", "hours"],
        [split.minute , "minute", "minutes"],
        [split.second, "second", "seconds"],
  ];
  var out = ""
  for (const [time, label, plural] of fm) {
    if (time !== 0) {
      out += time + " " + (time === 1 ? label : plural) + " "
    }
  }
  return out;
}

export default DurationTypes

export const durationTexts: Record<string, DurationTypes> = {
  "Rounds": DurationTypes.Rounds,
  "Time": DurationTypes.Seconds,
  "Long Rest": DurationTypes.LongRest,
  "Short Rest": DurationTypes.ShortRest
}

export function toTime(duration: number, type: DurationTypes) {
  switch(type) {
    case DurationTypes.Rounds: return duration + " Rounds";
    case DurationTypes.Seconds: return sformat(duration);
    case DurationTypes.LongRest: return "Long Rest";
    case DurationTypes.ShortRest: return "Short Rest";
    default: return "Error";
  }
}