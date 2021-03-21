<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="w-100">
      <div>
        <b class="mr-3">{{ fio }}</b>
      </div>
      <div class="small">
        <div v-if="inn || phone || email">
          <text-with-label v-if="inn" name="ИНН" :text="inn"/>
          <text-with-label v-if="email" name="Email" :text="email"/>
          <text-with-label v-if="phone" name="Телефон" :text="phone"/>
        </div>
        <div>
          <span v-for="relation in relatedOrganizations" :key="relation.id"
                v-if="relation.organization.id === organizationId">
            <b-badge class="p-1 mr-1">{{relation.relationship.name}}</b-badge>
          </span>
        </div>
      </div>
    </div>
    <div class="flex-shrink-1 pr-2 col-md-2">
      Заполнение
      <b-progress :value="fillFactor" :max="100" />
    </div>
    <div class="flex-shrink-1 pr-2">
      <g-button-link-edit :to="linkUpdate"/>
    </div>
    <div class="flex-shrink-1 pr-2" v-if="!invisibleRole">
      <g-button-link-list :to="linkRelations"/>
    </div>
    <div class="flex-shrink-1" v-if="!invisibleRole">
      <g-button-link-delete :to="linkDestroy"/>
    </div>
  </div>
</template>

<script>
  import TextWithLabel from "~views/globality/textWithLabel";
  import UserHelper from "~classes/Helpers/User";
  import GButtonLinkEdit from "~views/globality/buttons/link/edit";
  import GButtonLinkList from "~views/globality/buttons/link/list";
  import GButtonLinkDelete from "~views/globality/buttons/link/delete";

  export default {
    name: "item",
    components: {GButtonLinkDelete, GButtonLinkList, GButtonLinkEdit, TextWithLabel},
    computed: {
      fio() {
        return UserHelper.fio(this);
      },
      role() {
        return this.$route.meta.role
      },
      linkParams() {
        return {organizationId: this.organizationId, id: this.id}
      },
      linkDestroy() {
        return this.invisibleRole?'/':{name: this.role + '-user-destroy', params: this.linkParams}
      },
      linkUpdate() {
        return {name: this.role + '-user-update', params: this.linkParams}
      },
      linkRelations() {
        return this.invisibleRole?'/':{name: this.role + '-user-relations', params: this.linkParams};
      },
      invisibleRole(){
        return this.role ==='stream_leader';
      }
    },
    props: {
      id: {type: String},
      organizationId: {type: String},
      name: {type: String},
      surname: {type: String},
      patronymic: {type: String},
      email: {type: String},
      inn: {type: String},
      phone: {type: String},
      fillFactor: {type: Number},
      relatedOrganizations: {
        type: Array,
        default() {
          return [{
            id: null,
            organization: {
              id: null
            },
            relationship: {
              name: null,
              slug: null
            }
          }]
        }
      }
    }
  }
</script>
