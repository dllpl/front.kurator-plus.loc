<template>
  <div>
    <h1>Планы на каникулы</h1>
    <b-card>
      <div class="d-flex">
        <div class="align-self-center">
          Фильтры
        </div>
        <div class="ml-2">
          <b-select v-model="stream" :options="streamsSelect"/>
        </div>
        <div class="ml-2">
          <b-select v-model="season" :options="[{value:null,text:'не выбрано'}].concat(...seasons.getSelectOptions())"/>
        </div>
      </div>
    </b-card>
    <div class="my-2">
      <b-button @click="$router.push({name:role+'-report-vacation-plan-create'})" variant="success">
        Добавить отчет
      </b-button>
    </div>
    <b-card>
      <div class="row">
        <div class="col-md-4" v-for="item in items" :key="item.id">
          <b-card no-body class="card-link"
                  @click="$router.push({name:role+'-report-vacation-plan-update',params:{id:item.id}})"
                  :border-variant="statuses.getObjectByKey(item.status).variant">
            <b-card-body :class="['weather-background',item.season]">
              <div class="row">
                <div class="col-md-4">
                  <h4>
                    {{item.learningStream.name}}
                    <small><small class="text-muted">{{item.learningStream.year}}</small></small>
                  </h4>
                  <h5>
                    {{seasons.getTitleByKey(item.season)}} {{item.learningStream.year}}
                  </h5>
                </div>
                <div class="col-md-8 text-right">
                  <div>
                    <small class="text-muted">сохранено:</small> {{item.updatedAt}}
                  </div>
                  <div v-if="item.status === 'approved'">
                    <small class="text-muted">принято:</small> {{item.moderatedAt}}
                  </div>
                  <div v-if="item.status === 'rejected'">
                    <small class="text-muted">возвращено:</small> {{item.moderatedAt}}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <b-badge v-if="item.status === 'saved'">Черновик</b-badge>
                <b-badge v-if="item.status === 'sent'" variant="warning">Отправлено</b-badge>
                <b-badge v-if="item.status === 'approved'" variant="success">Принято</b-badge>
                <b-badge v-if="item.status === 'rejected'" variant="danger">Возвращено</b-badge>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
  import GlobalList from "~views/globality/crud/list";

  import GqlReports from '~gql/reports/vacationPlan/queryVacationPlans.graphql';
  import ReportStatuses from "@/enums/reportStatuses";
  import Seasons from "@/enums/seasons";
  import StreamsGql from '~gql/streams/list.graphql'
  import MyStreams from "~classes/Helpers/StreamsByStreamLeader";

  export default {
    name: "list",
    extends: GlobalList,
    data: function () {
      const seasons = Seasons;
      const statuses = ReportStatuses;

      let items = [];

      return {
        streams: [],
        stream: null,
        seasons: seasons,
        season: null,

        statuses: statuses,

        items: items
      }
    },
    mounted() {
      this.getStreams();
    },
    methods: {
      getDataQuery() {
        return GqlReports;
      },
      getDataResponse(data) {
        return data.vacationPlans;
      },
      getDataVariables() {
        return {
          learningStreamId: this.stream,
          season: this.season,
          first: 999
        };
      },
      getStreams() {
        this.$apollo.query({
          query: StreamsGql,
          variables: {
            organizationId: this.$route.params.organizationId,
            first: 999
          }
        }).then(({errors, data}) => {
          this.streams = MyStreams(data.organization.learningStreams.data, this.me.id);
        });
      },
      isEditableItem(item) {
        return ['saved', 'rejected'].find((statusCode) => statusCode === item.status) !== undefined;
      }
    },
    watch: {
      stream() {
        this.getData();
      },
      season() {
        this.getData();
      }
    },
    computed: {
      streamsSelect() {
        return [{value: null, text: 'не выбрано'}].concat(...this.streams.map(item => {
          return {value: item.id, text: item.name + '(' + item.year + ')'}
        }));
      },
      me() {
        return this.$store.state.user.me
      },
      role() {
        return this.$route.meta.role;
      }
    }
  }
</script>

<style lang="scss">
  .card-link {
    opacity: 0.75;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  .weather-background {
    overflow: hidden;
    position: relative;

    &:before {
      position: absolute;
      font-weight: 900;
      font-family: 'Font Awesome 5 Free';
      font-size: 100px;
      bottom: -50px;
      left: -20px;
      opacity: 0.1;
    }

    &.summer:before {
      content: "\f185";
    }

    &.winter:before {
      content: "\f2dc";
      font-weight: 400;
    }

    &.autumn:before {
      content: "\f0e9";
    }

    &.spring:before {
      content: "\f4d8";
    }
  }
</style>
