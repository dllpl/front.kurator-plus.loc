import Enum from "@/enums/enum";


const adminForm = ['adminCreateForm', 'adminUpdateForm'];
const directorForm = ['directorCreateForm', 'directorUpdateForm'];
const teacherForm = ['teacherCreateForm', 'teacherUpdateForm'];

const admin = [...adminForm, 'directorRoute', 'goTo', 'adminAttachRole'];
const director = [...directorForm, 'goTo', 'directorRoute', 'directorAttachRole','adminAttachRole'];
const stream_leader = [...teacherForm, 'goTo','streamLeaderRoute'];

class Roles extends Enum {
  constructor() {
    super();
    this.data = {
      director: {
        title: 'Директор',
        titleMenu: 'Директор',
        title2: 'директора',
        tags: admin
      },
      secretary: {
        title: 'Секретарь',
        titleMenu: 'Секретарь',
        title2: 'Секретарь',
        tags: director
      },
      deputy_director_education: {
        title: 'Зам. по воспитательной работе',
        titleMenu: 'Зам. по ВР',
        title2: 'Зам. по воспитательной работе',
        tags: director
      },
      deputy_director_academy: {
        title: 'Зам. по учебной работе',
        titleMenu: 'Зам. по УР',
        title2: 'Зам. по учебной работе',
        tags: director
      },
      deputy_director_methodology: {
        title: 'Зам. по методической работе',
        titleMenu: 'Зам. по МР',
        title2: 'Зам. по методической работе',
        tags: director
      },
      deputy_director_supply: {
        title: 'Зам. по хозяйственной части',
        titleMenu: 'Зам. по ХЧ',
        title2: 'Зам. по хозяйственной части',
        tags: director
      },
      stream_leader: {
        title: 'Классный руководитель',
        titleMenu: 'Класс. рук.',
        title2: 'Классного руководителя',
        tags: stream_leader.concat(['directorAttachRole','adminAttachRole'])
      },
      psychologist: {
        title: 'Психолог',
        titleMenu: 'Психолог',
        title2: 'Психолога',
        tags: director
      },
      teacher: {
        title: 'Учитель',
        titleMenu: 'Учитель',
        title2: 'Учителя',
        tags: ['directorAttachRole','adminAttachRole']
      },
      student: {title: 'Ученик', titleMenu: 'Ученик', title2: 'Ученика', tags: ['directorAttachRole','adminAttachRole']},
      parent: {title: 'Родитель', titleMenu: 'Родитель', title2: 'Родителя', tags: ['directorAttachRole','adminAttachRole']}
    };
  }

  getTitle(key, item) {
    return item.title;
  }

  getKey(key, item) {
    return key;
  }

  /**
   *
   * @param tagsArray
   * @param {CallableFunction} closureFunction
   * @return {Array}
   */
  getSelectOptionsByTagsAny(tagsArray = [], closureFunction) {
    let result = {};

    for (let key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        let item = this.data[key];
        if (tagsArray.some((DesiriedTag) => (item.tags.indexOf(DesiriedTag) >= 0))) {
          result[key] = item;
        }
      }
    }
    if (closureFunction) {
      return closureFunction(result);
    } else {
      return this._makeSelectOptions(result);
    }
  }

  /**
   *
   * @param tagsArray
   * @param {CallableFunction} closureFunction
   * @return {Array}
   */
  getSelectOptionsByTagsAll(tagsArray = [], closureFunction) {
    let result = {};

    for (let key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        let item = this.data[key];
        if (tagsArray.every((DesiriedTag) => (item.tags.indexOf(DesiriedTag) >= 0))) {
          result[key] = item;
        }
      }
    }

    if (closureFunction) {
      return closureFunction(result);
    } else {
      return this._makeSelectOptions(result);
    }
  }
}

export default Roles;
