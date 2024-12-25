export interface IColorFilter<T> {
  color: string;
  value: string | boolean;
  tooltip?: string;
  filterParam?: keyof T;
}
