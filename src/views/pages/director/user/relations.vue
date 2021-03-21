<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <button class="btn btn-success" @click="createItem">Назначить</button>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"></busy>
        <slot v-else>
          <list-item v-for="item in items" v-bind:key="item.id" v-bind="item" @destroy="destroyItem"></list-item>
        </slot>
      </b-card-body>
    </b-card>
    <b-modal hide-footer
             ok-title="Сохранить"
             cancel-title="Отменить"
             ref="create" scrollable title="Назначить связь"
    >
      <b-form @submit="onSubmitCreateForm" @reset="onResetCreateForm">
        <b-container fluid>
          <b-row>
            <b-col md="6">Организация</b-col>
            <b-col md="6">
              <b-form-group>
                <b-select name="organizations" v-model="createForm.model.dirty.organization"
                          :options="createForm.organizations"
                          required disabled></b-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">Роль</b-col>
            <b-col md="6">
              <b-form-group>
                <b-select name="roles" v-model="createForm.model.dirty.role" :options="createForm.roles"
                          required></b-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12" class="text-right">
              <b-button type="reset" variant="danger" class="mr-2">Сбросить</b-button>
              <b-button type="submit" variant="primary">Сохранить</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./relations/item";
    import GlobalList from "~views/globality/crud/listLite";
    import QueryByUser from "~gql/user2org/byUser.graphql";
    import QueryOrganizations from "~gql/organization/queryOrganizations.graphql";
    import linkUserToOrganization from "~gql/user2org/linkUserToOrganization.graphql";
    import unlinkUserFromOrganization from "~gql/user2org/unlinkUserFromOrganization.graphql";
    import Roles from "@/enums/roles";

    export default {
        name: "list",
        extends: GlobalList,
        props: ['id'],
        components: {ListItem, GBtnCreate, Busy},
        data() {
            return {
                items: [
                    {id: '', organization: {id: null, name: null}, relationship: {slug: null, name: null}},
                ],
                createForm: {
                    model: {
                        original: {
                            organization: this.$route.params.organizationId,
                            role: null,
                        },
                        dirty: {
                            organization: null,
                            role: null,
                        }
                    },
                    roles: new Roles().getSelectOptions(),
                    organizations: []
                }
            }
        },
        methods: {
            getDataResponse(data) {
                let relOrg = data.user.relatedOrganizations ? data.user.relatedOrganizations : [];
                return relOrg.filter(item=>item.organization.id === this.$route.params.organizationId)
            },
            getDataQuery() {
                return QueryByUser;
            },
            getDataVariables() {
                return {
                    id: this.id
                }
            },
            destroyItem(id) {
                this.$bvModal.msgBoxConfirm('Вы точно хотите удалить назначение?', {
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'ДА',
                    cancelTitle: 'НЕТ',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                    .then(value => {
                        if (value === true) {
                            this.$apollo.mutate({
                                mutation: unlinkUserFromOrganization,
                                errorPolicy: 'all',
                                variables: {id: id}
                            }).then(({errors, data}) => {
                                this.getData();
                            })
                        }
                    })
                    .catch(err => {
                        // An error occurred
                    })
            },
            createItem() {
                if (!this.createForm.organizations.length) {
                    this.$apollo.query({
                        query: QueryOrganizations,
                        errorPolicy: 'all',
                        variables: {perPage: 100}
                    }).then(({errors, data}) => {
                        let array = data.organizations.data.map((currentValue, index, array) => {
                            return {value: currentValue.id, text: currentValue.name}
                        });
                        array.unshift({value: null, text: 'Выберите организацию'});
                        this.createForm.organizations = array;
                    });
                }
                this.createForm.model.dirty = Object.assign({}, this.createForm.model.original);// Reset our form values
                this.$refs['create'].show();
            },
            onSubmitCreateForm(evt) {
                evt.preventDefault();
                this.$apollo.mutate({
                    mutation: linkUserToOrganization,
                    errorPolicy: 'all',
                    variables: {
                        userId: this.id,
                        organizationId: this.createForm.model.dirty.organization,
                        relationship: this.createForm.model.dirty.role
                    },
                }).then(({errors}) => {
                    this.getData();
                    this.$refs['create'].hide();
                });
            },
            onResetCreateForm(evt) {
                evt.preventDefault();

                this.createForm.model.dirty = Object.assign({}, this.createForm.model.original);// Reset our form values

                // Trick to reset/clear native browser form validation state
            }
        }
    }

</script>
