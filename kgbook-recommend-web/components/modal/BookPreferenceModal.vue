<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import type { Preference, UserPreference } from "~/types/Preference";

const visible = defineModel<boolean>("visible");

const userContextOptions = [
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

const bookInterestOptions = [
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

const readingHabitOptions = [
  "거의 안 읽는다",
  "하루 30분 미만",
  "하루 30분 ~ 1시간",
  "하루 1시간 이상",
  "주말에 몰아서 읽는다",
];

const bookStylePreferenceOptions = [
  "짧고 간결한 글을 선호함",
  "스토리텔링이 있는 흥미로운 책",
  "사실 위주의 정보성 콘텐츠",
  "감정에 울림을 주는 감동적인 내용",
  "생각할 거리를 던지는 깊이 있는 내용",
  "가볍게 웃으며 읽을 수 있는 유쾌한 책",
];

// Default values for user preference
const defaultUserPreference: UserPreference = {
  job: "",
  interests: [],
  readTime: "",
  style: [],
  recentBook: "",
};

const defaultPreference: Preference = {
  isSubmitted: false,
  user: defaultUserPreference,
};

const userPreference = useLocalStorage<Preference>(
  "userPreference",
  defaultPreference,
);

const selected = ref<UserPreference>(defaultUserPreference);

watch(
  () => visible.value,
  (opened) => {
    if (opened && userPreference.value?.user) {
      selected.value = structuredClone(toRaw(userPreference.value.user));
    }
  },
);

function submitPreferences() {
  userPreference.value.isSubmitted = true;
  userPreference.value.user = structuredClone(toRaw(selected.value));
  visible.value = false;
}

function hideModal() {
  visible.value = false;
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="true"
    :style="{ width: '60rem' }"
    header="당신을 위한 책을 추천해 드려요."
    modal
    @hide="hideModal"
  >
    <p class="text-sm pb-4 text-gray-500">
      해당 정보는 추천을 위해 사용되며 영구적으로 저장하지 않습니다.
    </p>
    <div class="flex flex-col gap-4">
      <Dropdown
        v-model="selected.job"
        :options="userContextOptions"
        filter
        placeholder="직무를 선택하세요"
      />
      <MultiSelect
        v-model="selected.interests"
        :options="bookInterestOptions"
        filter
        placeholder="관심 있는 분야"
      />
      <div>
        <label class="block mb-1">하루 독서 시간</label>
        <div class="flex gap-2">
          <div v-for="option in readingHabitOptions" :key="option">
            <RadioButton
              v-model="selected.readTime"
              :input-id="option"
              :value="option"
            />
            <label :for="option" class="ml-1">{{ option }}</label>
          </div>
        </div>
      </div>
      <MultiSelect
        v-model="selected.style"
        :options="bookStylePreferenceOptions"
        filter
        placeholder="선호하는 스타일"
      />
      <InputText
        v-model="selected.recentBook"
        placeholder="최근 읽은 책 (선택 사항)"
      />

      <div class="flex justify-end gap-2">
        <Button label="Save" type="button" @click="submitPreferences" />
      </div>
    </div>
  </Dialog>
</template>
