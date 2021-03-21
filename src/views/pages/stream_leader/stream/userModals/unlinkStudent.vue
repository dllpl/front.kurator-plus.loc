<template>
  <b-modal hide-footer ref="form" scrollable title="Удалить ученика" v-model="isShowModal" body-border-variant="danger"
           header-bg-variant="danger">
    <b-form @submit="onSubmit" @reset="onReset" v-if="isShow">
      <b-container fluid>
        <b-row>
          <b-col md="12">
            Вы хотите удалить из класса ученика: <strong>{{fio}}</strong>
          </b-col>
        </b-row>
      </b-container>
      <hr class="row"/>
      <b-row>
        <b-col md="12" class="text-right">
          <b-button type="reset" variant="danger" class="mr-2">Сбросить</b-button>
          <b-button type="submit" variant="primary">Удалить</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
    import DeleteMutation from '~gql/streams/users/unlinkStudent.graphql';
    import formModal from '~views/globality/crud/formModal';

    export default {
        extends: formModal,
        inheritAttrs: false,
        name: "unlinkStudent-modal",
        props: ['name', 'surname', 'patronymic', 'organizationId', 'learningStreamId', 'id'],
        data() {
            return {
                isShow: true,
            }
        },
        computed: {
            fio() {
                return [this.surname, this.name, this.patronymic].filter(value => value).join(' ');
            }
        },
        methods: {
            // region optional getters
            getModelFields() {
                return {
                    learningStreamId: this.learningStreamId,
                    userId: this.id,
                }
            },
            getSubmitQuery() {
                return DeleteMutation
            },

            getSubmitVariables() {
                return this.model.dirty
            },
            // endregion

            // region callbacks
            eSaveError(errors) {
                return errors;
            },
            eSaveSuccess() {
                this.$emit('updateListData');
                this.hide();
                return null;
            },
            // endregion
        }
    }
</script>
