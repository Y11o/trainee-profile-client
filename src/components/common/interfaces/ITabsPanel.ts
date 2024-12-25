import type { Component } from 'vue';

export interface ITabsPanel {
  title: string;
  path: string;
  component: Component;
}
