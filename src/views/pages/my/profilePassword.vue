<template>
  <div>
    <h1>Профиль</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-card no-body>
        <slot v-if="isBusy">
          <busy v-if="isBusy"></busy>
        </slot>
        <slot v-else>
          <b-card-body>
            <b-row class="mb-2">
              <b-col md="2" class="text-md-right">Текущий пароль</b-col>
              <b-col md="2">
                <b-input name="currentPassword" type="password" v-model="model.dirty.currentPassword" required></b-input>
              </b-col>
              <b-col md="2" class="text-md-right">Пароль</b-col>
              <b-col md="2">
                <b-input name="password" type="password" v-model="model.dirty.password" required></b-input>
              </b-col>
            </b-row>
          </b-card-body>
          <b-card-footer class="text-right">
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
    import GqlUpdate from "~gql/me/updatePassword.graphql";
    import ATVUpdateMe from "@/apolloToVuex/updateMe";
    import ApolloProvider from "@/initers/apollo";

    export default {
        name: "profile",
        components: {Busy},
        extends: GlobForm,
        mounted() {
            this.redirectUrl = {name: 'my-profile-password'}
        },
        methods: {
            getModelFields() {
                return {
                    currentPassword: null,
                    password: null,
                }
            },
            getSubmitQuery() {
                return GqlUpdate
            },
            eSaveSuccess() {
                ATVUpdateMe(ApolloProvider.defaultClient, this.$store, 'ifTimeout');
            }
        }
    }
</script>
