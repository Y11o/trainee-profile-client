import { defineStore } from 'pinia';
import TablesData from '@/components/pages/TimeTable/model/tables_data.json';

export const useTableDataStore = defineStore('tableData', {
  state: () => ({
    tablePlanParameters: [
      {
        value: 16, 
        title: 'КАБИНЕТ 16',
        layout: TablesData.layout_16,
        col: 11,
      },
      {
        value: 18, 
        title: 'КАБИНЕТ 18',
        layout: TablesData.layout_18,
        col: 12,
      },
      {
        value: 37, 
        title: 'КАБИНЕТ 37',
        layout: TablesData.layout_37,
        col: 11,
      }
    ]
  })
});