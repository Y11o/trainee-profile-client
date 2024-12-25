<template>
  <div class="version-block d-flex flex-column justify-center text-caption">
    <template v-if="versions.profile && versions.schedule && appVersion">
      <span>Клиентская часть v.{{ appVersion }}</span>
      <span>Серверная часть v.{{ versions.profile }}</span>
      <span v-if="isSchedulePage">Сервис расписания v.{{ versions.schedule }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PropertiesApi } from '@/components/common/network/PropertiesApi';

const route = useRoute();

const propertiesApi = new PropertiesApi('/properties');

const versions = ref<{ profile: string, schedule: string }>({
  profile: '',
  schedule: '',
});

const isSchedulePage = computed(() => route.name === 'TimeTablePage');

const appVersion = computed(() => __APP_VERSION__);

const getProfileVersion = async () =>
  propertiesApi.getProfileVersion()
    .then((data) => versions.value.profile = data.version)
    .catch((e) => console.error(e));

const getScheduleVersion = async () =>
  propertiesApi.getScheduleVersion()
    .then((data) => versions.value.schedule = data.version)
    .catch((e) => console.error(e));

onBeforeMount(() => Promise.all([getProfileVersion(), getScheduleVersion()]));
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

.version-block {
  line-height: 1.55;
  min-width: 160px;
  color: $lk-gr;
}
</style>
