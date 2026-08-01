const ZODIAC_BOUNDARIES: { name: string; from: number }[] = [
  { name: "물병자리", from: 120 },
  { name: "물고기자리", from: 219 },
  { name: "양자리", from: 321 },
  { name: "황소자리", from: 420 },
  { name: "쌍둥이자리", from: 521 },
  { name: "게자리", from: 622 },
  { name: "사자자리", from: 723 },
  { name: "처녀자리", from: 823 },
  { name: "천칭자리", from: 923 },
  { name: "전갈자리", from: 1024 },
  { name: "사수자리", from: 1123 },
  { name: "염소자리", from: 1222 },
];

export function getZodiacSign(birthdate: string): string {
  const [, monthStr, dayStr] = birthdate.split("-");
  const monthDay = Number(monthStr) * 100 + Number(dayStr);

  if (monthDay < ZODIAC_BOUNDARIES[0].from) return "염소자리";

  let sign = "염소자리";
  for (const boundary of ZODIAC_BOUNDARIES) {
    if (monthDay >= boundary.from) sign = boundary.name;
  }
  return sign;
}
