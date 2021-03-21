<template>
  <b-modal hide-footer ref="form" scrollable title="Удалить класс" v-model="isShowModal" body-border-variant="danger"
           header-bg-variant="danger">
    <b-form @submit="onSubmit" @reset="onReset" v-if="isShow">
      <b-container fluid>
        <b-row>
          <b-col md="12">
            Вы хотите удалить <strong>"{{name}}" {{year}}</strong>
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
    import DeleteMutation from '~gql/streams/delete.graphql';
    import formModal from '~views/globality/crud/formModal';

    export default {
        extends: formModal,
        inheritAttrs: false,
        name: "destroy-modal",
        props: {
            organizationId: {
                type: String,
                required: true
            },
            id: String,
            name: String,
            year: Number,
        },
        data() {
            return {
                isShow: true,
            }
        },
        methods: {
            // region optional getters
            getModelFields() {
                return {
                    learningStreamId: this.id,
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
            eSaveError(errors){
                return errors;
            },
            eSaveSuccess(){
                this.$emit('updateListData');
                this.hide();
                return null;
            },
            // endregion
        }
    }
</script>
