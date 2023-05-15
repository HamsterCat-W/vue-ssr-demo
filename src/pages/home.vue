<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="test">
    <h3>{{ t('test') }}</h3>
  </div>
</template>

<style scoped lang="css">
.test {
  color: cadetblue;
}
</style>
