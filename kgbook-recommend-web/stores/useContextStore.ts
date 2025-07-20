export type UserContext = {
  dataInDisplay: Record<string, unknown>;
};

export const useContextStore = defineStore("context", () => {
  const context = ref<UserContext>({
    dataInDisplay: {},
  });

  return { context };
});
