<template>
  <div class="row h-100 justify-content-center align-items-center">
    <div class="col align-self-stretch">
      <div>
        <b-card no-body>
          <b-card-body>
            <h4><span class="border-bottom text-black-50">{{role.title}}</span>
              {{organization.shortName?organization.shortName:organization.name}}</h4>
            <h5>
              {{fio}}
            </h5>
            <strong>Сегодня:</strong> {{ new Date() | moment('LLL') }}
            <fill-factor-progress class="mt-3" />
          </b-card-body>
        </b-card>
      </div>
      <div class="row">
        <div class="col">
          <b-button type="button" class="col pt-3 pb-3" :to="{name:'my-profile'}" variant="light">
            <i class="fas fa-user fa-3x mr-5 ml-5"/>
            <hr/>
            Профиль
          </b-button>
        </div>
        <slot>
          <div class="col">
            <b-button type="button" class="col pt-3 pb-3" :to="{name:this.$route.meta.role + '-stream-list'}"
                      variant="light">
              <i class="fas fa-building fa-3x mr-5 ml-5"/>
              <hr/>
              Классы
              <b-badge variant="primary">{{streams}}</b-badge>
            </b-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  import MoveTo from "~views/pages/my/moveTo";
  import GQLSuperuser from "~gql/dashboard/streamleader.graphql";
  import Roles from "@/enums/roles";
  import UserHelper from "~classes/Helpers/User";
  import FillFactorProgress from "~views/globality/fillFactorProgress";

  export default {
    name: "dashboard",
    components: {FillFactorProgress, MoveTo},
    data() {
      return {
        role: new Roles().getObjectByKey(this.$route.meta.role),
        streams: 0,
        organization: {
          name: '',
          shortName: ''
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
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.$apollo.query({
          query: GQLSuperuser,
          variables: {
            organizationId: this.$route.params.organizationId,
            myRelationship: this.$route.meta.role
          }
        }).then(({data, errors}) => {
          if (!errors) {
            this.streams = data.organization.learningStreams.paginatorInfo.total;
            this.organization = data.organization;
          }
        });
      }
    }
  }
</script>
