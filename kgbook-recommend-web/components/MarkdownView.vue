<script lang="ts" setup>
import { config, MdPreview } from "md-editor-v3";
import KO_KR from "@vavt/cm-extension/dist/locale/ko-KR";
import LinkAttributes from "markdown-it-link-attributes";
import "md-editor-v3/lib/preview.css";

defineProps<{ content: string }>();
const id = useId();

config({
  editorConfig: {
    languageUserDefined: {
      "ko-KR": KO_KR,
    },
  },
  markdownItConfig(md) {
    md.use(LinkAttributes, {
      attrs: {
        target: "_blank",
      },
    });
  },
});
</script>

<template>
  <MdPreview :id="id" :model-value="content" class="md-view" language="ko-KR" />
</template>

<style>
.md-view {
  ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }
}
</style>
