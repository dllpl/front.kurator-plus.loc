<template>
  <b-form @submit="onSubmit">
    <b-card no-body border-variant="warning">
      <slot v-if="isBusy">
        <busy v-if="isBusy"></busy>
      </slot>
      <slot v-else>
        <b-card-header header-bg-variant="warning">
          Вы собираетесь удалить пользователя !!!
        </b-card-header>
        <b-card-body>
          <div>
            Если вы удалите пользователя, он потеряет доступ ко всей информации.
          </div>
          <div>
            <strong class="mr-2">Название:</strong>
            <slot v-if="model.dirty.name">{{model.dirty.name}}</slot>
            <slot class="ml-2 mr-2" v-if="model.dirty.name &&model.dirty.shortName"></slot>
            <slot v-if="model.dirty.shortName">{{model.dirty.shortName}}</slot>
          </div>
          <div>
            <strong class="mr-2">ИНН/КПП:</strong>
            <slot>{{model.dirty.inn?model.dirty.inn:'нет'}}</slot>
            /
            <slot>{{model.dirty.ogrn?model.dirty.ogrn:'нет'}}</slot>
          </div>
        </b-card-body>
        <b-card-footer class="text-right">
          <b-button type="submit" class="mr-1" variant="danger">Удалить</b-button>
        </b-card-footer>
      </slot>
    </b-card>
  </b-form>
</template>

<script>
    import Busy from "~views/globality/busy";
    import GlobForm from "~views/globality/crud/form"

    import QueryUser from "~gql/user/queryUser.graphql"
    import DeleteUser from "~gql/user/deleteUser.graphql"

    export default {
        name: "destroy",
        extends: GlobForm,
        props: {
            id: {
                type: String,
                required: true
            }
        },
        components: {Busy},
        mounted() {
            this.getData();
            this.redirectUrl = {name:'admin-user-list'}
        },
        methods: {
            getDataResponse(data) {
                return data.user;
            },
            getModelFields() {
                return {
                    name: '',
                    surname: '',
                    inn: '',
                    phone: '',
                    email: '',
                    patronymic: ''
                }
            },
            getSubmitQuery() {
                return DeleteUser
            },
            getDataQuery() {
                return QueryUser
            }
        },
        notifications: {
            nSaveSuccess: { // You can have any name you want instead of 'showLoginError'
                title: 'Пользователь удален',

                type: 'success' // You also can use 'VueNotifications.types.error' instead of 'error'
            },
            nSaveFail: { // You can have any name you want instead of 'showLoginError'
                title: 'Пользователя удалить не удалось',

                type: 'error' // You also can use 'VueNotifications.types.error' instead of 'error'
            },
        }
    }
</script>
