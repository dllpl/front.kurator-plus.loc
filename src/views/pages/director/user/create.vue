<template>
  <b-form @submit.prevent="onSubmitPrevent" @reset="onReset" v-if="show">
    <b-card no-body>
      <b-card-body>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Фамилия</b-col>
          <b-col md="2">
            <b-input name="surname" v-model="model.dirty.surname" :state="(!$v.surname.$error)?null:false"/>
            <b-form-invalid-feedback v-if="$v.surname.$error">
              Фамилия обязательна для заполнения
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="2" class="text-md-right">Имя</b-col>
          <b-col md="2">
            <b-input name="name" v-model="model.dirty.name" :state="(!$v.name.$error)?null:false"/>
            <b-form-invalid-feedback v-if="$v.name.$error">
              Имя обазательно для заполнения
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="2" class="text-md-right">Отчество</b-col>
          <b-col md="2">
            <b-input name="patronymic" v-model="model.dirty.patronymic"/>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">ИНН</b-col>
          <b-col md="2">
            <b-input name="inn" :masked="false" class="form-control"
                     v-mask="['#### ###### ##']" v-model="model.dirty.inn"
                     :state="(!$v.inn.$error)?null:false"/>
            <b-form-invalid-feedback v-if="!$v.inn.required">
              Нужно ввести ИНН или Email
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="$v.inn.$error">
              Должно быть 12 симоволов
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="2" class="text-md-right">Телефон</b-col>
          <b-col md="2">
            <b-input name="phone" type="tel" class="form-control"
                     v-mask="['+7(###) ###-## ##','+7(###) ###-## ## доб. ###']" v-model="model.dirty.phone"
                     :state="(!$v.phone.$error)?null:false"/>
            <b-form-invalid-feedback v-if="$v.phone.$error">
              Должно быть более 3 цифр
            </b-form-invalid-feedback>
          </b-col>
          <b-col md="2" class="text-md-right">Email</b-col>
          <b-col md="2">
            <b-input name="email" type="email" v-model="model.dirty.email"
                     :state="(!$v.email.$error)?null:false"/>
            <b-form-invalid-feedback v-if="!$v.email.required">
              Нужно ввести Email или ИНН
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="$v.email.$error">
              Неверно указан email
            </b-form-invalid-feedback>
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
        <hr/>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Роль</b-col>
          <b-col md="10">
            <b-form-checkbox-group
              v-model="selectedRoles"
              :options="role!=='stream_leader'?selectRoles:selectRoles.filter(item=>item.value==='student')"
              name="roles"
              :state="(!$v.roles.$error)?null:false" :disabled="role==='stream_leader'"
            >
              <b-form-invalid-feedback :state="!$v.roles.$error">
                <hr/>
                Нужно выбрать хоть одну роль
              </b-form-invalid-feedback>
            </b-form-checkbox-group>
          </b-col>
        </b-row>
        <hr/>
        <b-row class="mb-2">
          <b-col md="2" class="text-md-right">Пароль</b-col>
          <b-col md="2">
            <b-input name="password" type="password" v-model="model.dirty.password"
                     :state="(!$v.password.$error)?null:false"/>
            <b-form-invalid-feedback v-if="$v.password.$error">
              Имя обазательно для заполнения
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer class="text-right">
        <b-button type="submit" class="mr-1" variant="primary" :disabled="submitStatus === 'PENDING'">Сохранить
        </b-button>
        <b-button type="reset" variant="danger">Сбросить</b-button>
      </b-card-footer>
    </b-card>
  </b-form>
</template>

<script>
  import GqlCreateUser from "~gql/user/createUser.graphql";
  import GqlAttachRole from "~gql/user2org/linkUserToOrganization.graphql";
  import form from "~views/globality/crud/form";
  import Roles from "@/enums/roles";
  import requiredUnless from 'vuelidate/lib/validators/requiredUnless'

  export default {
    name: "create",
    extends: form,
    data() {
      return {
        selectRoles: new Roles().getSelectOptionsByTagsAny(['directorAttachRole']),
        selectedRoles: this.role!=='stream_leader'?['student']:[],
        errorsMessages: {
          duplicate: {
            desired: 'Unique violation',
            title: 'Пользователь с таким ИНН или Email уже существует',
            type: 'error'
          },
          save: {
            title: 'Создать пользователя не удалось',
            type: 'error'
          }
        }
      };
    },
    mounted() {
      this.redirectUrl = {name: this.$route.meta.role + '-user-list', params: this.$route.params}
    },
    methods: {
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
          password: null
        }
      },
      getSubmitQuery() {
        return GqlCreateUser
      },
      onSubmitPrevent(evt) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.onSubmit(evt);
        }
      },
      eSaveSuccess(data) {
        let id = data.createUser.id;
        this.selectedRoles.forEach((value) => {
          this.$apollo.mutate({
            mutation: GqlAttachRole,
            variables: {
              userId: id,
              organizationId: this.$route.params.organizationId,
              relationship: value
            }
          });
        });
      },
      validState(name, rule) {
        return this.validSubmit(name, rule) ? null : false;
      },
      validSubmit(name, rule) {
        return (!this.$v[name].$error) || (this.$v[name].$error && !this.$v[name][rule]);
      }
    },
    computed: {
      isNotEmptyEmailOrInn() {
        return Boolean(this.model.dirty.email) || Boolean(this.model.dirty.inn);
      },
      role(){
        return this.$route.meta.role;
      }
    },
    validations: {
      inn: {
        required: requiredUnless('isNotEmptyEmailOrInn'),
        valid() {
          return !this.model.dirty.inn || (this.model.dirty.inn.replace(/[^0-9]/g, '').length === 12);
        },
      },
      phone: {
        valid() {
          return !this.model.dirty.phone || (this.model.dirty.phone.length > 3);
        }
      },
      email: {
        required: requiredUnless('isNotEmptyEmailOrInn'),
        valid() {
          return !this.model.dirty.email || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.model.dirty.email)
        },
      },
      name: {
        valid() {
          return Boolean(this.model.dirty.name);
        }
      },
      surname: {
        valid() {
          return Boolean(this.model.dirty.surname);
        }

      },
      password: {
        valid() {
          return Boolean(this.model.dirty.password);
        }
      },
      roles: {
        valid() {
          return this.selectedRoles.length > 0;
        }
      }
    }
  }
</script>
