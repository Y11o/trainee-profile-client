import iconNICUrl from '@/assets/img/logo/NIC.svg';
import iconCRTRISUrl from '@/assets/img/logo/CRTRIS.svg';
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
  { id: 1, title: 'НИЦ', img: iconNICUrl, link: 'https://rec-etu.com/' },
  { id: 2, title: 'ЦРТРИС', img: iconCRTRISUrl, link: 'https://university.nicetu.spb.ru/' },
  { id: 3, title: 'GitLab', img: iconGitLabUrl, link: 'http://git.nic.etu/' },
  { id: 4, title: 'Jira', img: iconJiraUrl, link: 'http://jira.nicetu.spb.ru/' },
];
