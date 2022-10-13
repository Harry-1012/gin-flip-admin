<template>
  <div style="height:80vh">
    <!-- <iframe width="100%" height="100%" :src="`${basePath}:${basePort}/form-generator/#/`" frameborder="0" /> -->
    <iframe
      width="100%"
      height="100%"
      src="https://form.making.link/basic-version/#/zh-CN/"
    />

  </div>
</template>

<script>
export default {
  name: "FormGenerator",
};
</script>

<script setup>
import { ref } from "vue";
const basePath = ref(import.meta.env.VITE_BASE_PATH).value;
const basePort = ref(import.meta.env.VITE_SERVER_PORT).value;
let frameUrl = config.hostname+"/apiv3/form-generator/"
if (import.meta.env.DEV) {
  frameUrl = (basePath +":"+ basePort + "/form-generator/#/");
}else{
  frameUrl = ref(import.meta.env.GEN_FORM_URL).value
}
</script>
