import type { Preference } from "~/types/Preference";
import { useLocalStorage } from "@vueuse/core";

export const userContextOptions = [
  "개발자 (Software Engineer)",
  "기획자 (Product Manager)",
  "디자이너 (UX/UI Designer)",
  "마케터 (Digital/Brand Marketer)",
  "창작자 (작가, 에디터 등)",
  "연구자/학자 (논문, 리서치 중심)",
  "학생 (수험생 포함)",
  "취업 준비생",
  "직장인 (업무 관련 독서 위주)",
  "자기계발 중인 일반 독자",
];

export const bookInterestOptions = [
  "인문/철학",
  "심리학",
  "사회/정치",
  "경제/경영",
  "기술/개발",
  "자기계발",
  "문학/소설",
  "SF/판타지",
  "역사",
  "과학 일반",
  "여행/에세이",
  "예술/디자인",
];

export const readingHabitOptions = [
  "거의 안 읽는다",
  "하루 30분 미만",
  "하루 30분 ~ 1시간",
  "하루 1시간 이상",
  "주말에 몰아서 읽는다",
];

export const bookStylePreferenceOptions = [
  "짧고 간결한 글을 선호함",
  "스토리텔링이 있는 흥미로운 책",
  "사실 위주의 정보성 콘텐츠",
  "감정에 울림을 주는 감동적인 내용",
  "생각할 거리를 던지는 깊이 있는 내용",
  "가볍게 웃으며 읽을 수 있는 유쾌한 책",
];

export const usePreference = () => {
  function createDefaultPreference(): Preference {
    return {
      isSubmitted: false,
      user: {
        job: "",
        interests: [],
        readTime: "",
        style: [],
        recentBook: "",
      },
    };
  }

  const userPreference = useLocalStorage<Preference>(
    "userPreference",
    createDefaultPreference(),
  );

  return { createDefaultPreference, userPreference };
};
