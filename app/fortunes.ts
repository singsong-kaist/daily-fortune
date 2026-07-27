export const fortunes = [
  "오늘은 뜻밖의 좋은 소식이 들려올 거예요.",
  "작은 용기가 큰 변화를 만드는 하루입니다.",
  "주변 사람과의 대화 속에서 좋은 아이디어를 얻게 돼요.",
  "미뤄뒀던 일을 시작하기 딱 좋은 날이에요.",
  "생각보다 일이 순조롭게 풀리는 하루가 될 거예요.",
  "누군가에게 뜻밖의 도움을 받게 될 수 있어요.",
  "오늘의 선택이 좋은 결과로 이어질 거예요.",
  "여유를 가지면 더 좋은 기회가 보이는 날이에요.",
  "오랜만에 연락 온 사람과 반가운 소식이 있어요.",
  "지금까지의 노력이 서서히 빛을 발하기 시작해요.",
  "새로운 것을 시도해보기에 좋은 타이밍이에요.",
  "마음이 편안해지는 좋은 일이 생길 거예요.",
  "재정적으로 작은 행운이 따르는 하루입니다.",
  "건강을 챙기면 컨디션이 눈에 띄게 좋아져요.",
  "낯선 사람과의 만남이 좋은 인연이 될 수 있어요.",
];

export const luckyItems = [
  "우산",
  "동전 지갑",
  "파란색 볼펜",
  "손거울",
  "커피 한 잔",
  "노란 머그컵",
  "책 한 권",
  "향초",
  "귀여운 스티커",
  "손편지",
  "초록색 식물",
  "이어폰",
  "손목시계",
  "작은 인형",
  "향수",
];

export function getRandomFortune() {
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  const luckyItem = luckyItems[Math.floor(Math.random() * luckyItems.length)];
  const luckyNumber = Math.floor(Math.random() * 45) + 1;
  return { fortune, luckyItem, luckyNumber };
}
