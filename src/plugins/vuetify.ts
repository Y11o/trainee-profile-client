import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      clearable: true
    },
    VBtn: {
      disabled: false,
    },
    VCombobox: {
      density: 'compact',
      clearable: true,
      variant: 'outlined'
    },
    VDataTable: {
      loadingText: 'Загрузка...',
      noDataText: 'Нет данных',
    },
    VDataTableVirtual: {
      loadingText: 'Загрузка...',
      noDataText: 'Нет данных',
    },
    VSkeletonLoader: {
      color: 'transparent'
    }
  }
});

export default vuetify;
