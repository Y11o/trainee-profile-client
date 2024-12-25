import { mount as testUtilsMount, VueWrapper } from '@vue/test-utils';
import type { Component } from 'vue';
import vuetify from '@/plugins/vuetify';

export const mountWithVuetify = (
  component: Component, 
  parameters?: Parameters<typeof testUtilsMount>[1]
) => testUtilsMount(component, {
  global: {
    plugins: [
      vuetify,
    ],
  },
  ...parameters,
});

export const setVTextField = (dataTest: string, value: string) =>
  async (wrapper: VueWrapper) => await wrapper
    .find(`[data-test="${dataTest}"]`)
    .find('input[type="text"]')
    .setValue(value);
