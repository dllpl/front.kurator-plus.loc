<template>
  <b-modal hide-footer ref="form" scrollable title="Создать класс" v-model="isShowModal">
    <b-form @submit="onSubmit" @reset="onReset" v-if="isShow">
      <b-container fluid>
        <b-row>
          <b-col md="6">Название</b-col>
          <b-col md="6">
            <b-form-group>
              <b-input v-model="model.dirty.name" name="name" required></b-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">Год обучения</b-col>
          <b-col md="6">
            <b-form-group>
              <b-form-radio-group
                v-model="model.dirty.year"
                name="year"
                :options="[2019,2020]"
                required></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
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
    import UpdateMutation from '~gql/streams/update.graphql';
    import formModal from '~views/globality/crud/formModal';

    export default {
        extends: formModal,
        inheritAttrs: false,
        name: "update-modal",
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
                    year: this.year,
                    name: this.name,
                    organizationId: this.organizationId,
                }
            },
            getSubmitQuery() {
                return UpdateMutation
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
