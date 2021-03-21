<template>
  <div>
    <div class="row">
      <b-col :md="9">
        <h1>Профиль</h1>
      </b-col>
      <b-col :md="3" class="d-flex align-items-center">
        <fill-factor-progress class="w-100 text-right"/>
      </b-col>
    </div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-card no-body>
        <slot v-if="isBusy">
          <busy v-if="isBusy" />
        </slot>
        <slot v-else>
          <b-card-body>
            <b-row class="mb-2">
              <b-col md="2" class="text-md-right">Фамилия</b-col>
              <b-col md="2">
                <b-input name="surname" v-model="model.dirty.surname" required />
              </b-col>
              <b-col md="2" class="text-md-right">Имя</b-col>
              <b-col md="2">
                <b-input name="name" v-model="model.dirty.name" required />
              </b-col>
              <b-col md="2" class="text-md-right">Отчество</b-col>
              <b-col md="2">
                <b-input name="patronymic" v-model="model.dirty.patronymic" />
              </b-col>
            </b-row>
            <b-row class="mb-2">
              <b-col md="2" class="text-md-right">ИНН</b-col>
              <b-col md="2">
                <b-input name="inn" v-model="model.dirty.inn"></b-input>
              </b-col>
              <b-col md="2" class="text-md-right">Телефон</b-col>
              <b-col md="2">
                <b-input name="phone" type="tel" v-model="model.dirty.phone"></b-input>
              </b-col>
              <b-col md="2" class="text-md-right">Email</b-col>
              <b-col md="2">
                <b-input name="email" type="email" v-model="model.dirty.email"></b-input>
              </b-col>
            </b-row>
            <b-row class="mb-2">
              <b-col md="2" class="text-md-right">Дата рождения</b-col>
              <b-col md="2">
                <b-input name="birthDate" type="date" v-model="model.dirty.birthDate"/>
              </b-col>
              <b-col md="2" class="text-md-right">Пол</b-col>
              <b-col md="2">
                <b-select :options="[{value:'male',text:'М'},{value:'female',text:'Ж'}]" v-model="model.dirty.gender"/>
              </b-col>
            </b-row>
          </b-card-body>
          <b-card-footer class="text-right">
            <b-button type="link" :to="{name:'my-profile-password'}" class="pull-left">Сменить пароль</b-button>
            <b-button type="submit" class="mr-1" variant="primary">Сохранить</b-button>
            <b-button type="reset" variant="danger">Сбросить</b-button>
          </b-card-footer>
        </slot>
      </b-card>
    </b-form>
  </div>
</template>

<script>
    import GlobForm from "~views/globality/crud/form"
    import Busy from "~views/globality/busy";
    import GqlUpdate from "~gql/me/updateMe.graphql";
    import GqlShow from "~gql/me/queryMe.graphql";
    import ATVUpdateMe from "@/apolloToVuex/updateMe";
    import ApolloProvider from "@/initers/apollo";
    import FillFactorProgress from "~views/globality/fillFactorProgress";

    export default {
        name: "profile",
        components: {FillFactorProgress, Busy},
        extends: GlobForm,
        mounted() {
            this.getData();
            this.redirectUrl = {name: 'my-profile'}
        },
        methods: {
            getDataResponse(data) {
                return data.me;
            },
            getModelFields() {
                return {
                    name: '',
                    surname: '',
                    inn: '',
                    phone: '',
                    email: '',
                    patronymic: '',
                    birthDate: '',
                    gender:null,
                }
            },
            getSubmitQuery() {
                return GqlUpdate
            },
            getDataQuery() {
                return GqlShow
            },
            eSaveSuccess() {
                ATVUpdateMe(ApolloProvider.defaultClient, this.$store);
            }
        }
    }
</script>
