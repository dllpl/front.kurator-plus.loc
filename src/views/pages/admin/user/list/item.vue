<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="w-100">
      <div>
        <i v-if="gender === 'male'" class="fas fa-mars mr-2"/>
        <i v-if="gender === 'female'" class="fas fa-venus mr-2"/>
        <b class="mr-3">{{fio.join(' ')}}</b>
      </div>
      <div class="small">
        <div v-if="inn || phone || email">
          <text-with-label v-if="inn" name="ИНН" :text="inn"/>
          <text-with-label v-if="email" name="Email" :text="email"/>
          <text-with-label v-if="phone" name="Телефон" :text="phone"/>
        </div>
      </div>
    </div>
    <div class="flex-shrink-1 pr-2 col-md-2">
      <text-with-label name="Заполнено на " :text="fillFactor+'%'"/>
      <b-progress :value="fillFactor" :max="100"/>
    </div>
    <div class="flex-shrink-1 pr-2">
      <g-button-link-edit :to="{name:'admin-user-update',params:{id:id}}"/>
    </div>
    <div class="flex-shrink-1 pr-2">
      <g-button-link-list :to="{name:'admin-user-relations',params:{id:id}}"/>
    </div>
    <div class="flex-shrink-1">
      <g-button-link-delete :to="{name:'admin-user-destroy',params:{id:id}}"/>
    </div>
  </div>
</template>

<script>
  import TextWithLabel from "~views/globality/textWithLabel";
  import GButtonLinkDelete from "~views/globality/buttons/link/delete";
  import GButtonLinkEdit from "~views/globality/buttons/link/edit";
  import GButtonLinkList from "~views/globality/buttons/link/list";

  export default {
    name: "item",
    components: {
      GButtonLinkList,
      GButtonLinkEdit,
      GButtonLinkDelete,
      TextWithLabel
    },
    computed: {
      fio() {
        return [this.surname, this.name, this.patronymic].filter(value => value);
      }
    },
    props: {
      id: {type: String},
      name: {type: String},
      surname: {type: String},
      patronymic: {type: String},
      email: {type: String},
      inn: {type: String},
      phone: {type: String},
      fillFactor: {type: Number},
      gender: {type: String}
    }
  }
</script>
