<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <b-card no-body>
      <b-card-body>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Уникальный код</b-col>
          <b-col md="2">
            <b-input autocomplete="off" name="slug" no-wheel v-model="model.dirty.slug" required></b-input>
          </b-col>
          <b-col offset-md="4" md="2" class="text-md-right">ИНН</b-col>
          <b-col md="2">
            <b-input name="inn" v-model="model.dirty.inn" required></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Краткое название</b-col>
          <b-col md="2">
            <b-input name="shortName" v-model="model.dirty.shortName" required></b-input>
          </b-col>
          <b-col md="2" class="text-md-right">Телефон</b-col>
          <b-col md="2">
            <b-input name="phone" type="tel" v-model="model.dirty.phone"></b-input>
          </b-col>
          <b-col md="2" class="text-md-right">ОГРН</b-col>
          <b-col md="2">
            <b-input name="ogrn" v-model="model.dirty.ogrn" required></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Полное название</b-col>
          <b-col md="10">
            <b-input name="name" v-model="model.dirty.name" required></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Адрес</b-col>
          <b-col md="10">
            <b-input name="address" v-model="model.dirty.address"></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Описание</b-col>
          <b-col md="10">
            <b-textarea name="description" v-model="model.dirty.description"></b-textarea>
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer class="text-right">
        <b-button type="submit" class="mr-1" variant="primary">Сохранить</b-button>
        <b-button type="reset" variant="danger">Сбросить</b-button>
      </b-card-footer>
    </b-card>
  </b-form>
</template>

<script>
    import Busy from "~views/globality/busy";
    import GlobForm from "~views/globality/crud/form"
    import cyrillicToTranslit from "cyrillic-to-translit-js";

    import CreateOrganization from "~gql/organization/createOrganization.graphql"

    export default {
        name: "create",
        extends: GlobForm,
        components: {Busy},
        mounted() {
            this.redirectUrl = {name:'admin-organization-list'}
        },
        methods: {
            getDataResponse(data){
                return data.organization;
            },
            getModelFields() {
                return {
                    slug: '',
                    name: '',
                    description: '',
                    shortName: '',
                    address: '',
                    phone: '',
                    inn: '',
                    ogrn: '',
                    type: 'educational'
                }
            },
            getSubmitQuery() {
                return CreateOrganization
            }
        },
        watch: {
            'model.dirty.shortName'(value,valueOld) {
                let textOld = cyrillicToTranslit().transform(valueOld, "_").replace(/[^a-zA-Z0-9]/g, '_');
                if(this.model.dirty.slug && textOld !== this.model.dirty.slug) return;

                let text = cyrillicToTranslit().transform(value, "_").replace(/[^a-zA-Z0-9]/g, '_');
                this.model.dirty.slug = text.replace(/[^a-zA-Z0-9]/g, '_')
            }
        }
    }
</script>
