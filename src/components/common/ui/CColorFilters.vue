<template>
  <div class="d-flex align-center justify-center flex-nowrap ga-1">
    <v-btn
      v-for="filter in filters"
      :key="filter.value"
      density="compact"
      variant="text"
      v-tooltip="filter.tooltip"
      :icon="icons[filter.color]"
      :color="filter.color"
      :data-test="`table-filter-${filter.value}`"
      @click="onApplyFilters(filter)"
    />
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T, F extends IColorFilter<T>"
>
import { ref, watch } from 'vue';
import type { IColorFilter } from '@/components/common/interfaces/IColorFilter';

/**
 * filterParam - свойство, по значению которого будет вестись фильтрация.
 * Если оно одно, то можно указать отдельным пропом, если несколько - указывается каждое для объектов в filters.
 * @param {T[]} [itemsToFilter = []] - массив объектов, которые нужно отфильтровать
 * @param {IColorFilter[]} [filters = []] - массив объектов-фильтров
 *        (color - цвет; filterParam?; value - значение свойства; tooltip - текст подсказки)
 * @param {keyof T} [filterParam = ''] - свойство, по значению которого будет вестись фильтрация
 * @param {string} [allShownFilterText = 'Все'] - значение value у фильтра "Показать все", если он есть в filters
 */
const props = withDefaults(
  defineProps<{
    itemsToFilter?: T[];
    filters: F[];
    filterParam?: keyof T;
    allShownFilterText?: string;
  }>(),
  {
    itemsToFilter: () => [],
    filters: () => [],
    allShownFilterText: 'Все',
  },
);

const emit = defineEmits(['onApplyFilters']);

/** Текущий цвет */
const currentFilterColor = ref<string | null>(null);

const filtersIcons = Object.fromEntries(props.filters.map((item) => [item.color, 'mdi-circle']));

const icons = ref({ ...filtersIcons });

/** Обновление иконок */
watch(currentFilterColor, () => {
  Object.assign(icons.value, filtersIcons);

  if (currentFilterColor.value) {
    icons.value[currentFilterColor.value] = 'mdi-circle-outline';
  }
});

/** Метод фильтрации полученных данных и назначение данным определенного цвета */
const handleTableFilterChange = (filter: IColorFilter<T>): T[] => {
  if (filter.value === props.allShownFilterText || currentFilterColor.value === filter.color) {
    currentFilterColor.value = null;
    return props.itemsToFilter;
  } else {
    currentFilterColor.value = filter.color;

    const currentFilterParam = props.filterParam || filter.filterParam;

    if (currentFilterParam) {
      return props.itemsToFilter.filter((item) => item[currentFilterParam] === filter.value);
    }

    return props.itemsToFilter;
  }
};

/** Применение фильтров */
const onApplyFilters = (filter: IColorFilter<T>) => emit('onApplyFilters', handleTableFilterChange(filter));
</script>
