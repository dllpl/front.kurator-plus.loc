<template>
  <b-form>
    <div class="container" style="width: 800px;">
      <b-card class="">
        <h1>Данные по кадрам</h1>

        <div class="text-left forvac">Учителя:</div>
        <select class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
          <option selected>Русский язык</option>
          <option value="1">Математика</option>
          <option value="2">Физика</option>
          <option value="3">История</option>
        </select>

        <div class="text-left forvac mt-3">Другие</div>
        <select class="custom-select my-1 mr-sm-2 mb-3" id="inlineFormCustomSelectPref">
          <option selected>Сантехник</option>
          <option value="1">Сторож</option>
          <option value="2">Уброщик</option>
          <option value="3">История</option>
        </select>








        <b-form inline class="mb-4" @submit="onSubmit" v-if="!readonly">




          <div class="text-right" v-if="!readonly">
            <b-button variant="success" type="submit" @click.capture="send=false" class="mx-1">Сохранить</b-button>
            <b-button variant="success" type="submit" @click.capture="send=true" class="mx-1">Сохранить и отправить
            </b-button>
            <b-button variant="warning" class="mx-1" v-if="!this.$route.params.id">Отмена</b-button>
            <b-button variant="danger" class="mx-1" v-else @click="deleteQuery">Удалить</b-button>
          </div>
        </b-form>
        <div v-else>
          <div>
            Учитель: <u class="mr-2">{{meFio}}</u>
            класс: <u class="mr-2">{{remoteData.learningStream.name}} ({{remoteData.learningStream.year}})</u>
            сезон: <u class="mr-2">{{seasons.getTitleByKey(model.dirty.season)}} {{model.dirty.year}}</u>
          </div>
          <pages-stream_leader-reports-vacation_plan-table :readonly="readonly" v-model="model.dirty.data"/>
          <div class="text-right">
            <div><b>Отправлено:</b> {{remoteData.updatedAt}}</div>
          </div>
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
    import CreateGql from '~gql/reports/vacationPlan/createVacationPlan.graphql'
    import UpdateGql from '~gql/reports/vacationPlan/updateVacationPlan.graphql'
    import DeleteGql from '~gql/reports/vacationPlan/deleteVacationPlan.graphql'
    import ItemGql from '~gql/reports/vacationPlan/queryVacationPlan.graphql'
    import SendGql from '~gql/reports/vacationPlan/sendVacationPlan.graphql'
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
                        id: null
                    }
                },
                readonly: true,
                send: false,
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
                this.readonly = (['saved', 'rejected'].find((item) => item === dataLocal.status) === undefined);

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
                    id: this.$route.params.id,
                    learningStreamId: null,
                    season: null,
                    year: null,
                    data: ''
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
            deleteQuery() {
                this.$apollo.mutate({
                    mutation: DeleteGql,
                    variables: {
                        id: this.$route.params.id,
                    }
                }).then(() => {
                    this.$router.push(this.redirectUrl);
                });
            },
            sendQuery() {
                this.$apollo.mutate({
                    mutation: SendGql,
                    variables: {
                        id: this.$route.params.id,
                    }
                });
            },
            getSubmitQuery() {
                if (this.$route.params.id) {
                    return UpdateGql;
                }
                else {
                    return CreateGql;
                }
            },
            getSubmitVariables() {
                let dirty = clearVueEvents(this.model.dirty);
                return dirty;
            },
            eSaveSuccess() {
                if (this.send) {
                    this.sendQuery();
                }
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

<style lang="scss" scoped>
  .forvac {
    font-size: 30px;
  }
  .table-vac {
    margin: 10px;
    width: 300px;

  }


</style>
