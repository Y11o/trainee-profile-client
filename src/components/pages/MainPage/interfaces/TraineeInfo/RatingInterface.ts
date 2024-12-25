/**
 * @property {number} id ID записи
 * @property {number} grade балл, начисленный или удаленный у стажера
 * @property {boolean} isPlus начислен или удален балл
 * @property {'Теория' | 'Практика' | 'Проект' | 'Просрочка'} type за что был добавлен/удален балл
 * @property {string} name название курса, мероприятия, задачи итд итп, за что был добавлен/удален балл
 */
interface RatingData {
  id: number,
  grade: number,
  isPlus: boolean,
  type: 'Теория' | 'Практика' | 'Проект' | 'Просрочка',
  name: string
}
