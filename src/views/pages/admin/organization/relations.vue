<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <top @loadData="getData"
             :per-page="paginator.perPage"
             :first-item="paginator.firstItem"
             :total="paginator.total" class="border-bottom pb-3"/>
        <div class="pt-3">
          <button class="btn btn-success" @click="createItem">Назначить</button>
        </div>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"></busy>
        <slot v-else>
          <div class="p-2">
            Найдено записей: {{paginator.total}}
          </div>
          <list-item v-for="item in items" v-bind:key="item.id" v-bind="item" @destroy="destroyItem"/>
        </slot>
      </b-card-body>
    </b-card>
    <b-modal hide-footer
             ok-title="Сохранить"
             cancel-title="Отменить"
             ref="create" title="Назначить связь"
    >
      <b-form @submit="onSubmitCreateForm" @reset="onResetCreateForm">
        <b-container fluid>
          <b-row>
            <b-col md="4">Пользователь</b-col>
            <b-col>
              <b-form-group>
                <multiselect
                  v-model="createForm.selectedUser"
                  :options="createForm.users"
                  track-by="id"
                  :showLabels="false"
                  :custom-label="customLabel"
                  :allow-empty="false"
                  :hideSelected="true"
                  :loading="createForm.isLoadingUsers"
                  placeholder="Выберите пользователя"
                  @search-change="fundUsers"
                >
                  <template slot="noOptions">Пользователи на найдены, попробуйте ввести имя</template>
                  <template slot="noResult">По данному запросу ничего на найдено</template>
                </multiselect>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4">Роль</b-col>
            <b-col>
              <b-form-group>
                <b-select name="roles" v-model="createForm.model.dirty.role" :options="createForm.roles" required/>
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
    import Top from "./relations/top";
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./relations/item";
    import GlobalList from "~views/globality/crud/list";
    import QueryByOrg from "~gql/user2org/byOrg.graphql";
    import QueryUsers from "~gql/user/queryUsers.graphql";
    import linkUserToOrganization from "~gql/user2org/linkUserToOrganization.graphql";
    import unlinkUserFromOrganization from "~gql/user2org/unlinkUserFromOrganization.graphql";
    import Roles from "@/enums/roles";
    import filterObject from 'filter-values';

    export default {
        name: "list",
        extends: GlobalList,
        props: ['id'],
        components: {ListItem, GBtnCreate, Busy, Top},
        data() {
            return {
                items: [],
                createForm: {
                    isLoadingUsers: false,
                    selectedUser: null,
                    model: {
                        original: {
                            user: null,
                            role: null,
                        },
                        dirty: {
                            user: null,
                            role: null,
                        }
                    },
                    roles: new Roles().getSelectOptionsByTagsAll(['adminAttachRole']),
                    users: []
                }
            }
        },
        watch: {
            'createForm.selectedUser'(newValue) {
                if (newValue) {
                    this.createForm.model.dirty.user = newValue.id
                } else {
                    this.createForm.model.dirty.user = null;
                }
            },
        },
        methods: {
            customLabel({name, surname}) {
                return [surname, name].join(' ')
            },
            fundUsers(query) {
                this.createForm.isLoadingUsers = true;
                this.$apollo.query({
                    query: QueryUsers,
                    variables: filterObject({
                        name: query.trim(),
                    }, (value) => {
                        return value;
                    })
                }).then(({data}) => {
                    this.createForm.users = data.users.data;
                    this.createForm.isLoadingUsers = false;
                })
            },
            getDataResponse(data) {
                return data.organization.relatedUsers ? data.organization.relatedUsers : [];
            },
            getDataQuery() {
                return QueryByOrg;
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
                this.fundUsers('');
                this.createForm.model.dirty = Object.assign({}, this.createForm.model.original);// Reset our form values
                this.$refs['create'].show();
            },
            onSubmitCreateForm(evt) {
                evt.preventDefault();
                this.$apollo.mutate({
                    mutation: linkUserToOrganization,
                    errorPolicy: 'all',
                    variables: {
                        userId: this.createForm.model.dirty.user,
                        organizationId: this.id,
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
            }
        }
    }

</script>
