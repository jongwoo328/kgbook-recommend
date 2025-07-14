<script lang="ts" setup>
import type { UserPreference } from "~/types/Preference";
import {
  bookInterestOptions,
  bookStylePreferenceOptions,
  readingHabitOptions,
  usePreference,
  userContextOptions,
} from "~/composables/usePreference";

const { createDefaultPreference, userPreference } = usePreference();

const visible = defineModel<boolean>("visible");

const selected = ref<UserPreference>(createDefaultPreference().user);

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
