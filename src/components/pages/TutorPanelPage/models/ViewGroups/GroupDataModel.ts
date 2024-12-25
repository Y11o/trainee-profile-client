import { GroupMemberModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupMemberModel';

/**
 * Класс данных с информацией о группе
 * @property {number} id идентификатор
 * @property {number} groupNumber номер группы
 * @property {string} departmentBranchName название департамента
 * @property {string} videoCallTime время еженедельного митинга
 * @property {GroupMemberModel[]} trainees стажеры, состоящие в группе
 */
export class GroupDataModel {
  constructor(json: IGroupData) {
    this.id = json.groupId;
    this.groupNumber = json.groupNumber;
    this.departmentBranchName = json.departmentBranchName;
    this.videoCallTime = json.videoCallTime;
    this.trainees = json.trainees.map((e) => new GroupMemberModel(e));
  }

  id: number;

  groupNumber: number;

  departmentBranchName: string;

  videoCallTime: string;

  trainees: GroupMemberModel[];
}
