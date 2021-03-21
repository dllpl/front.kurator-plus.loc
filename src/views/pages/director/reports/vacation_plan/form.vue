<template>

  <b-form>
    <div class="container" style="width: 800px;">
      <b-card class="">
        <h1>Планы на каникулы. 123</h1>
        <div>
          <div>
            Учитель: <u class="mr-2">{{reportFio}}</u>
            класс: <u class="mr-2">{{remoteData.learningStream.name}} ({{remoteData.learningStream.year}})</u>
            сезон: <u class="mr-2">{{seasons.getTitleByKey(model.dirty.season)}} {{model.dirty.year}}</u>
          </div>
          <pages-stream_leader-reports-vacation_plan-table :readonly="true" v-model="model.dirty.data"/>
          <div class="text-right">
            <div><b>Отправлено:</b> {{remoteData.updatedAt}}</div>
          </div>
          <template v-if="!readonly">
            <form @submit="onSubmit" class="my-2">
              <div class="text-right">
                <b-button variant="success" type="submit" class="mx-1">Принять</b-button>
              </div>
            </form>
            <form @submit="rejectQuery" v-if="!readonly" class="my-2">
              <b-textarea v-model="rejectReason" placeholder="Указать причину отказа" required></b-textarea>
              <div class="text-right mt-2">
                <b-button variant="danger" type="submit" @click.capture="reject=true" class="mx-1">Вернуть на исправление</b-button>
              </div>
            </form>
          </template>
        </div>
      </b-card>
    </div>
  </b-form>
</template>

<script>
  import gForm from "~views/globality/crud/form";

  import Editor from '@ckeditor/ckeditor5-build-inline';
  import PagesStream_leaderReportsVacation_planCell from "~views/pages/stream_leader/reports/vacation_plan/row";
  import UserHelper from "~classes/Helpers/User";
  import MyStreams from "~classes/Helpers/StreamsByStreamLeader";
  import StreamsGql from '~gql/streams/list.graphql'
  import ApproveGql from '~gql/reports/vacationPlan/approveVacationPlan.graphql'
  import RejectGql from '~gql/reports/vacationPlan/rejectVacationPlan.graphql'
  import ItemGql from '~gql/reports/vacationPlan/queryVacationPlan.graphql'
  import Seasons from "@/enums/seasons";
  import clearVueEvents from "~classes/clearVueEvents";
  import PagesStream_leaderReportsVacation_planTable from "~views/pages/stream_leader/reports/vacation_plan/table";

  export default {
    extends: gForm,
    name: "pages-stream_leader-reports-vacation_plan-form",
    components: {PagesStream_leaderReportsVacation_planTable, PagesStream_leaderReportsVacation_planCell, Editor},
    props: ['id'],
    data() {
      const seasons = Seasons;
      const years   = [2019, 2020];
      return {
        remoteData: {
          learningStream: {
            id: null,
          }
        },
        readonly: true,
        reject: false,
        rejectReason: "",
        seasons: seasons,
        streams: [],
        years: years,
        season: null,
        editor: Editor,
        editCell: true,
        editorConfig: {
          resize_enabled: true,
          toolbar: {
            items: [
              'bold',
              'italic',
              'link',
              '|',
              'undo',
              'redo',
              '|',
              'bulletedList',
              'numberedList'
            ]
          }
        }
      }
    },
    mounted() {
      this.getStreams();
      if (this.$route.params.id) {
        this.getData();
      }
      else {
        this.readonly = false;
      }
      this.redirectUrl = {name: this.$route.meta.role + '-report-vacation-plan-index', params: this.$route.params}
    },
    methods: {
      getDataQuery() {
        return ItemGql;
      },
      getDataVariables() {
        return {
          id: this.$route.params.id
        }
      },
      getDataResponse(data) {
        let dataLocal   = data.vacationPlan;
        this.remoteData = Object.assign(this.remoteData, dataLocal);
        this.$set(this.model.dirty, 'data', dataLocal.data);
        this.readonly = (['sent','saved'].find((item) => item === dataLocal.status) === undefined);

        this.model.original.learningStreamId = dataLocal.learningStream.id;
        this.model.dirty.learningStreamId    = dataLocal.learningStream.id;
        this.model.original.season           = dataLocal.season;
        this.model.dirty.season              = dataLocal.season;
        this.model.original.year             = dataLocal.year;
        this.model.dirty.year                = dataLocal.year;
        this.model.original.year             = dataLocal.year;
        this.model.dirty.year                = dataLocal.year;

      },
      getModelFields() {
        return {
          id: this.$route.params.id
        }
      },
      finishEditCell() {
        this.editCell = null;
      },
      getStreams() {
        this.$apollo.query({
          query: StreamsGql,
          variables: {
            organizationId: this.$route.params.organizationId,
            first: 999
          }
        }).then(({data}) => {
          this.streams = MyStreams(data.organization.learningStreams.data, this.me.id);
        });
      },
      rejectQuery() {
        this.$apollo.mutate({
          mutation: RejectGql,
          variables: {
            id: this.$route.params.id,
            reason: this.rejectReason,
          }
        }).then(() => {
          this.$router.push(this.redirectUrl);
        });
      },
      getSubmitQuery() {
          return ApproveGql;
      },
      getSubmitVariables() {
        let dirty  = clearVueEvents(this.model.dirty);
        return dirty;
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
      meFio() {
        return UserHelper.fioLite(this.me);
      },
      authorFio() {
        return UserHelper.fioLite(this.remoteData.user);
      },
      hasAuthor() {
        return (this.remoteData.user !== null && this.remoteData.user !== undefined)
      },
      reportFio() {
        if (this.hasAuthor) {
          return this.authorFio;
        }
        else {
          return this.meFio;
        }
      }
    }
  }
</script>
