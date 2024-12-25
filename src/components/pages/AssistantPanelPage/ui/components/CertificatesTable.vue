<template>
  <c-table-container header-density="default">
    <template #header>
      <div class="w-100 d-flex align-center justify-space-between">
        <v-badge
          class="d-flex align-center"
          color="#0987FC"
          inline
          :content="unreadCertificatesCount"
        >
          Сертификаты
        </v-badge>
        <c-color-filters
          :filters="certificatesStatuses"
          :items-to-filter="certificatesData"
          @on-apply-filters="filterTasksByStatus"
        />
      </div>
    </template>
    <v-data-table-virtual
      class="mb-1"
      height="356px"
      density="compact"
      hover
      expand-on-click
      show-expand
      :headers="headers"
      :items="displayedCertificates"
      :mobile="false"
    >
      <template
        #item="{ item, isExpanded, internalItem, toggleExpand }: { item: CertificateModel, [key: string]: any }">
        <tr
          class="cursor-pointer"
          @click="item.isCertificateRead = true; toggleExpand(internalItem)"
        >
          <td :class="getColumnClass(item)">
            <v-icon
              icon="mdi-circle-medium"
              :class="[getCertificateMarkerClass(item)]"
            />
          </td>
          <td :class="getColumnClass(item)">
            <span>{{ item.fullName }}</span>
          </td>
          <td :class="getColumnClass(item)">
            {{ item.groupNumber }}
          </td>
          <td :class="getColumnClass(item)">
            <span
              class="font-weight-medium text-decoration-underline cursor-pointer"
              @click="openLink(item.course.ref)"
            >
              {{ item.course.name }}
            </span>
          </td>
          <td :class="getColumnClass(item)">
            {{ item.creationTime.toLocaleDateString('ru-RU') }}
          </td>
          <td :class="getColumnClass(item)">
            <span class="text-decoration-underline cursor-pointer">{{ item.filePath.split('/').pop() }}</span>
          </td>
          <td :class="getColumnClass(item)">
            <score-counter
              v-if="isReadonlyCertificate(item)"
              class="score-counter"
              readonly
              :score="item.score"
            />
            <score-counter
              v-else
              class="score-counter"
              :score="item.score"
              @click.stop
              @change-score="(newScore) => item.score = newScore"
            />
          </td>
          <td>
            <span :class="getColorFromStatus(item.status)">
              {{ item.status }}
            </span>
          </td>
          <td>
            <v-icon :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"/>
          </td>
        </tr>
      </template>
      <template #expanded-row="{ columns, item }: { item: CertificateModel, [key: string]: any }">
        <tr>
          <td
            class="expanded-row"
            :colspan="columns.length"
          >
            <div class="d-flex justify-end ga-3 py-4">
              <template v-if="isReadonlyCertificate(item)">
                <span v-if="item.certificateStatusDate">
                  {{ `Сертификат ${item.status.toLowerCase()}: ` }}
                  <span class="font-weight-medium">
                    {{ item.certificateStatusDate }}
                  </span>
                </span>
              </template>
              <template v-else>
                <v-btn
                  class="certificate-info__button"
                  variant="outlined"
                  :disabled="isNaN(item.score)"
                  @click="formCertificateStatusData(item, true)"
                >
                  УТВЕРДИТЬ
                </v-btn>
                <v-btn
                  class="certificate-info__button"
                  variant="outlined"
                  :disabled="isNaN(item.score)"
                  @click="formCertificateStatusData(item, false)"
                >
                  ОТКАЗАТЬ
                </v-btn>
              </template>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount, ref } from 'vue';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { AssistantPanelApi } from '@/components/pages/AssistantPanelPage/network/AssistantPanelApi';
import { CertificateModel } from '@/components/pages/AssistantPanelPage/models/CertificateModel';
import { IColorFilter } from '@/components/common/interfaces/IColorFilter';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';
import CColorFilters from '@/components/common/ui/CColorFilters.vue';
import ScoreCounter from '@/components/pages/AssistantPanelPage/ui/components/ScoreCounter.vue';

const snackbarStore = useSnackbarStore();

const AssistantApi = new AssistantPanelApi('');

const certificatesData = ref<CertificateModel[]>([]);

const displayedCertificates = ref<CertificateModel[]>(certificatesData.value);

const unreadCertificatesCount = computed(() => certificatesData.value.filter(
  item => !item.isCertificateRead && item.status != 'Принят' && item.status != 'Отклонен').length
);

watch(() => certificatesData.value, () => displayedCertificates.value = certificatesData.value);

const certificatesStatuses: IColorFilter<CertificateModel>[] = [
  { color: 'white', filterParam: 'status', value: 'Все', tooltip: 'Показать все' },
  { color: 'black', filterParam: 'status', value: 'Ожидает проверки', tooltip: 'Активные сертификаты' },
  { color: 'blue', filterParam: 'isCertificateRead', value: false, tooltip: 'Новые сертификаты' },
  { color: 'green', filterParam: 'status', value: 'Принят', tooltip: 'Принятые сертификаты' },
  { color: 'red', filterParam: 'status', value: 'Отклонен', tooltip: 'Отклоненные сертификаты' },
];

const headers = [
  { title: '', value: 'isCertificateRead' },
  { title: 'ФИО стажера', value: 'trainee' },
  { title: 'Группа', value: 'groupNumber' },
  { title: 'Курс', value: 'course' },
  { title: 'Дата отправки', value: 'dateSent' },
  { title: 'Файл', value: 'file' },
  { title: 'Баллы', value: 'score' },
  { title: 'Статус', value: 'certificateStatus' },
] as object[];

onBeforeMount(async () => await getCertificatesData());

/**
 * Метод получения данных сертификатов. Вызывает метод {@link getCertificatesByTutor}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getCertificatesData = async () => AssistantApi.getCertificatesByTutor()
  .then((result) => {
    certificatesData.value = result.map(e => new CertificateModel(e));
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные сертификатов. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод обновления статуса сертификата. Вызывает метод {@link setCertificateStatus}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const updateCertificateStatus = async (id: number, status: INewCertificateStatus) =>
  AssistantApi.setCertificateStatus(id, status)
    .then(async () => {
      await getCertificatesData();
      snackbarStore.openSnackbar('Статус сертификата успешно обновлен.');
    })
    .catch(() =>
      snackbarStore.openSnackbar('Не удалось загрузить данные сертификатов. Обновите страницу.',
        { icon: 'error' }
      ));

/** Метод формирования данных для передачи их в метод {@link updateCertificateStatus} */
const formCertificateStatusData = (item: CertificateModel, newStatus: boolean) =>
  updateCertificateStatus(item.id, { rejectReason: '', score: item.score, status: newStatus });

/**
 * Метод установки цвета сертификата
 * @param {object} item сертификат, в отношении которого меняют цвет
 */
const getCertificateMarkerClass = (item: CertificateModel): string => {
  if (item.isCertificateRead || item.status === 'Принят' || item.status === 'Отклонен') {
    return 'opacity-0';
  }
  return 'blue';
};

/**
 * Метод установки цвета статуса сертификата
 * @param {string} item статус сертификата
 */
const getColorFromStatus = (item: string): string | void => {
  if (item === 'Принят') {
    return 'green';
  } else if (item === 'Отклонен') {
    return 'red';
  }
};

const isReadonlyCertificate = (item: CertificateModel): boolean =>
  item.status === 'Принят' || item.status === 'Отклонен';

const getColumnClass = (item: CertificateModel): string => isReadonlyCertificate(item) ? 'read-certificate-color' : '';

const filterTasksByStatus = (items: CertificateModel[]) => displayedCertificates.value = items;

const openLink = (link: string) => window.open(link, '_blank');
</script>

<style scoped lang="scss">
@import "src/styles/colorVars";

.green {
  color: $lk-green;
}

.red {
  color: $lk-red;
}

.blue {
  color: $lk-blue;
}

.read-certificate-color {
  color: $lk-gb-40;
}

.certificate-info__button {
  width: 142px;
  height: 32px;
  background: $lk-white;
  border: 1px solid $lk-gr-border;
  font-weight: 600;
}
</style>
