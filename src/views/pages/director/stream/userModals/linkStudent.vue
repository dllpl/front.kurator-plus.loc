<template>
  <b-modal hide-footer ref="form" :title="formTitle" v-model="isShowModal">
    <b-form @submit="onSubmit" @reset="onReset" v-if="isShow">
      <b-container fluid>
        <multiselect
          v-model="selectedUser"
          :options="users"
          track-by="id"
          :showLabels="false"
          :custom-label="customLabel"
          :allow-empty="false"
          :hideSelected="true"
          :loading="isLoadingUsers"
          placeholder="Выберите ученика"
          @search-change="fundUsers"
        >
          <template slot="noOptions">Пользователи на найдены, попробуйте ввести имя</template>
          <template slot="noResult">По данному запросу ничего на найдено</template>
        </multiselect>
      </b-container>
      <hr class="row"/>
      <b-row>
        <b-col md="12" class="text-right">
          <b-button type="reset" variant="danger" class="mr-2">Сбросить</b-button>
          <b-button type="submit" variant="primary">Сохранить</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
    import GqlLinkMutation from '~gql/streams/users/linkStudent.graphql';
    import GqlFindUser from '~gql/user/organizationQueryUsers.graphql';
    import formModal from '~views/globality/crud/formModal';
    import filterObject from 'filter-values';

    export default {
        extends: formModal,
        inheritAttrs: false,
        name: "linkStudent-modal",
        props: {
            learningStreamId: {
                type: String,
            },
            streamName: {
                type: String,
            }
        },
        data() {
            return {
                isShow: true,
                isShowModal: this.value,
                isLoadingUsers: false,
                users: [],
                selectedUser: null,
                errorsMessages: {
                    duplicate: {
                        desired: 'Unique violation',
                        title: 'Пользователь уже привязан к этому классу в роли ученика или классного руководителя',
                        type: 'error'
                    },
                    save: {
                        title: 'Сохранить не удалось',
                        type: 'error'
                    }
                },
            }
        },
        watch: {
            selectedUser(newValue) {
                if (newValue) {
                    this.model.dirty.userId = newValue.id
                } else {
                    this.model.dirty.userId = null;
                }
            },
            isShowModal(newValue){
                this._showOrHide(newValue);
            }
        },
        computed: {
            formTitle() {
                return 'Привязать ученика ' + this.streamName;
            }
        },
        methods: {
            customLabel({name,surname}){
                return [name,surname].join(' ')
            },
            // region optional getters
            getModelFields() {
                return {
                    learningStreamId: this.learningStreamId,
                    userId: null
                }
            },
            getSubmitQuery() {
                return GqlLinkMutation
            },
            // endregion

            // region callbacks
            eSaveSuccess() {
                this.$emit('updateListData');
                this.hide();
                return null;
            },
            eBeforeShow() {
                this.model.original.learningStreamId = this.learningStreamId;
                this.fundUsers('');
            },
            eAfterShow() {
            },
            fundUsers(query) {
                this.isLoadingUsers = true;
                this.$apollo.query({
                    query: GqlFindUser,
                    variables: filterObject({
                        fio: query.trim(),
                        organizationId: this.$route.params.organizationId,
                        usersRelationships: ['student'],
                        myRelationship: this.$route.meta.role
                    }, (value) => {
                        return value;
                    })
                }).then(({data}) => {
                    this.users = data.me.myUsers.data;
                    this.isLoadingUsers = false;
                })
            },
            // endregion
        }
    }
</script>
