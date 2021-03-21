import Enum from "@/enums/enum";

class ReportStatuses extends Enum {
  constructor() {
    super();
    this.data = {
      saved: {key: 'saved', name: 'Сохранено', 'variant': null},
      sent: {key: 'sent', name: 'Отправлено', 'variant': 'warning'},
      approved: {key: 'approved', name: 'Принято', 'variant': 'success'},
      rejected: {key: 'rejected', name: 'Возвращено', 'variant': 'danger'},
    };
  }

  getTitle(key, item) {
    return item.name;
  }

  getKey(key, item) {
    return key;
  }
}

export default new ReportStatuses;
