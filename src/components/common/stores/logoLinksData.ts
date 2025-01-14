import iconGitLabUrl from '@/assets/img/logo/GitLab.svg';
import iconJiraUrl from '@/assets/img/logo/Jira.svg';

/**
 * Объекты логотипов
 * @property {number} id ID
 * @property {String} title текст, выводимый вместо фото
 * @property {ImageBitmap} img картинка
 * @property {String} link ссылка, куда будет происходить переадресация при нажатии на картинку
 */
export const links = [
  { id: 3, title: 'GitLab', img: iconGitLabUrl, link: '' },
  { id: 4, title: 'Jira', img: iconJiraUrl, link: '' },
];
