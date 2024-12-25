import CColorFilters from '@/components/common/ui/CColorFilters.vue';
import { mountWithVuetify } from '../../utils';

const itemsToFilter = [
  {
    id: 1,
    name: 'ISTQB - Программа обучения Базового уровня (версия 2018)',
    type: 'Курс',
    status: 'В работе',
  },
  {
    id: 2,
    type: 'Курс',
    name: 'Vue-базовый курс',
    status: 'Просрочено',
  },
  {
    id: 3,
    type: 'Курс',
    name: 'Введение в серверное API. REST',
    status: 'Просрочено',
  },
  {
    id: 4,
    type: 'Курс',
    name: 'Введение в Git',
    status: 'Закрыт',
  },
  {
    id: 5,
    type: 'Курс',
    name: 'Ansible. Назначение, архитектура и примеры применения',
    status: 'Ожидает подтверждения ассистента',
  }
];

const filteredByField = [
  {
    id: 2,
    type: 'Курс',
    name: 'Vue-базовый курс',
    status: 'Просрочено',
  },
  {
    id: 3,
    type: 'Курс',
    name: 'Введение в серверное API. REST',
    status: 'Просрочено',
  },
];

const filters = [
  { color: '#559E15', value: 'Закрыт', tooltip: 'Закрыт' },
  { color: '#000000', value: 'В работе', tooltip: 'В работе' },
  { color: '#CD4141', value: 'Просрочено', tooltip: 'Просрочено' },
  {
    color: '#FFB22C',
    value: 'Ожидает подтверждения ассистента',
    tooltip: 'Ожидает подтверждения ассистента'
  }
];

const hexToRgb = (hex: string) => {
  const v = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return v ? `rgb(${parseInt(v[1], 16)}, ${parseInt(v[2], 16)}, ${parseInt(v[3], 16)})` : null;
};

describe('CColorFilters', () => {
  it('Рендер всех кнопок фильтрации', async () => {
    const wrapper = mountWithVuetify(CColorFilters, {
      props: {
        itemsToFilter,
        filters,
      }
    });

    expect(wrapper.findAll('button[type="button"]')).toHaveLength(4);

    expect(wrapper.find('[data-test="table-filter-Закрыт"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="table-filter-В работе"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="table-filter-Просрочено"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="table-filter-Ожидает подтверждения ассистента"]').exists()).toBe(true);
  });

  it('Фильтрация по полю', async () => {
    const wrapper = mountWithVuetify(CColorFilters, {
      props: {
        itemsToFilter,
        filters,
        filterParam: 'status',
      }
    });

    await wrapper.find('[data-test="table-filter-Просрочено"]').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().onApplyFilters.length).toBe(1);
    expect(wrapper.emitted().onApplyFilters[0]).toEqual([filteredByField]);
  });

  it('Применение стилей к иконке фильтрации', async () => {
    const wrapper = mountWithVuetify(CColorFilters, {
      props: {
        itemsToFilter,
        filters,
      }
    });

    await wrapper.find('[data-test="table-filter-Просрочено"]').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().onApplyFilters.length).toBe(1);

    expect(wrapper.find('[data-test="table-filter-Закрыт"] i.v-icon').classes()).toContain('mdi-circle');
    expect(wrapper.find('[data-test="table-filter-В работе"] i.v-icon').classes()).toContain('mdi-circle');
    expect(wrapper.find('[data-test="table-filter-Просрочено"] i.v-icon').classes()).toContain('mdi-circle-outline');
    expect(wrapper.find('[data-test="table-filter-Ожидает подтверждения ассистента"] i.v-icon').classes()).toContain('mdi-circle');

    expect(window.getComputedStyle(wrapper.find('[data-test="table-filter-Закрыт"]').element).color).toBe(hexToRgb('#559E15'));
    expect(window.getComputedStyle(wrapper.find('[data-test="table-filter-В работе"]').element).color).toBe(hexToRgb('#000000'));
    expect(window.getComputedStyle(wrapper.find('[data-test="table-filter-Просрочено"]').element).color).toBe(hexToRgb('#CD4141'));
    expect(window.getComputedStyle(wrapper.find('[data-test="table-filter-Ожидает подтверждения ассистента"]').element).color).toBe(hexToRgb('#FFB22C'));

    await wrapper.find('[data-test="table-filter-Закрыт"]').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().onApplyFilters.length).toBe(2);

    expect(wrapper.find('[data-test="table-filter-Закрыт"] i.v-icon').classes()).toContain('mdi-circle-outline');
    expect(wrapper.find('[data-test="table-filter-В работе"] i.v-icon').classes()).toContain('mdi-circle');
    expect(wrapper.find('[data-test="table-filter-Просрочено"] i.v-icon').classes()).toContain('mdi-circle');
    expect(wrapper.find('[data-test="table-filter-Ожидает подтверждения ассистента"] i.v-icon').classes()).toContain('mdi-circle');
  });

  it('Сброс фильтрации поля', async () => {
    const wrapper = mountWithVuetify(CColorFilters, {
      props: {
        itemsToFilter,
        filters,
        filterParam: 'status',
      }
    });

    await wrapper.find('[data-test="table-filter-Просрочено"]').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().onApplyFilters.length).toBe(1);
    expect(wrapper.emitted().onApplyFilters[0]).toEqual([filteredByField]);

    expect(wrapper.find('[data-test="table-filter-Просрочено"] i.v-icon').classes()).toContain('mdi-circle-outline');

    await wrapper.find('[data-test="table-filter-Просрочено"]').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().onApplyFilters.length).toBe(2);
    expect(wrapper.emitted().onApplyFilters[1]).toEqual([itemsToFilter]);

    expect(wrapper.find('[data-test="table-filter-Просрочено"] i.v-icon').classes()).toContain('mdi-circle');
  });
});
