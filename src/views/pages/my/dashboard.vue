<template>
  <div class="row h-100 justify-content-center align-items-center">
    <div class="col align-self-stretch">
      <div>
        <b-card no-body>
          <b-card-body>
            <h4>Добро пожаловать, {{fio}}</h4>

            <strong>Сегодня:</strong> {{ new Date() | moment('LLL') }}
            <fill-factor-progress class="mt-3" />
          </b-card-body>
        </b-card>
      </div>
      <div class="row">
        <div class="col">
          <b-button :to="{name:'my-profile'}" class="col pt-3 pb-3" type="button" variant="light">
            <i class="fas fa-user fa-3x mr-5 ml-5"/>
            <hr/>
            Профиль
          </b-button>
        </div>
        <slot v-if="me.superuser">
          <div class="col">
            <b-button :to="{name:'admin-organization-list'}" class="col pt-3 pb-3" type="button" variant="light">
              <i class="fas fa-building fa-3x mr-5 ml-5"/>
              <hr/>
              Организации
              <b-badge variant="primary">{{superuser.organizations}}</b-badge>
            </b-button>
          </div>
          <div class="col">
            <b-button :to="{name:'admin-user-list'}" class="col pt-3 pb-3" type="button" variant="light">
              <i class="fas fa-users fa-3x mr-5 ml-5"/>
              <hr/>
              Пользователи
              <b-badge variant="primary">{{superuser.users}}</b-badge>
            </b-button>
          </div>
        </slot>
      </div>
    </div>
    <div class="col align-self-stretch">
      <b-card no-body>
        <b-card-header>
          Перейти к ...
        </b-card-header>
        <move-to class="mb-0 border-0"/>
      </b-card>
    </div>
  </div>
</template>

<script>
  import MoveTo from "~views/pages/my/moveTo";
  import GQLSuperuser from "~gql/dashboard/superuser.graphql";
  import UserHelper from "~classes/Helpers/User";
  import FillFactorProgress from "~views/globality/fillFactorProgress";

  export default {
    name: "dashboard",
    components: {FillFactorProgress, MoveTo},
    data() {
      return {
        superuser: {
          users: 0,
          organizations: 0
        }
      }
    },
    computed: {
      me() {
        return this.$store.state.user.me;
      },
      fio() {
        return UserHelper.fio(this.me)
      }
    },
    watch: {
      'me.superuser'(newValue) {
        if (newValue) {
          this.getData();
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.me.superuser) {
          this.$apollo.query({
            query: GQLSuperuser
          }).then(({data, errors}) => {
            if (!errors) {
              this.superuser = {
                organizations: data.organizations.paginatorInfo.total,
                users: data.users.paginatorInfo.total
              }
            }
          });
        }
      }
    }
  }
</script>
