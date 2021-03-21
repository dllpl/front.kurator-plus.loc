<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <top @loadData="getData"
             :per-page="paginator.perPage"
             :first-item="paginator.firstItem"
             :total="paginator.total" class="border-bottom pb-3"></top>
        <div class="pt-3">
          <button class="btn btn-success" @click="linkForm">Добавить ученика</button>
        </div>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"></busy>
        <slot v-else>
          <div class="p-2">
            Найдено учеников: {{paginator.total}}
          </div>

          <list-item
            v-for="item in items"
            @unlinkStudent="unlinkStudent"
            v-bind:key="item.id"
            v-bind:organizationId="organizationId"
            v-bind="item"
          />
        </slot>
      </b-card-body>
    </b-card>
    <set-student-modal v-model="showModals.linkStudent" @updateListData="getData" v-bind="modalsData.linkStudent">
    </set-student-modal>
    <unlink-student-modal v-model="showModals.unlinkStudent" @updateListData="getData"
                          v-bind="modalsData.unlinkStudent">
    </unlink-student-modal>
  </div>
</template>

<script>
    import Top from "./userList/top";
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./userList/item";
    import GlobalList from "~views/globality/crud/list";

    import GqlStreams from '~gql/streams/read.graphql';
    import SetStudentModal from "~views/pages/director/stream/userModals/linkStudent";
    import UnlinkStudentModal from "~views/pages/director/stream/userModals/unlinkStudent";

    export default {
        name: "list",
        extends: GlobalList,
        components: {UnlinkStudentModal, SetStudentModal, ListItem, GBtnCreate, Busy, Top},
        data() {
            let orgId = this.$route.params.organizationId;
            let streamId = this.$route.params.learningStreamId;
            return {
                learningStream: {
                    id: null,
                    name: null,
                    year: null
                },
                items: [],
                organizationId: orgId,
                learningStreamId: streamId,
                modalsData: {
                    linkStudent: {
                        organizationId: orgId,
                        learningStreamId: streamId,
                        streamName: null
                    },
                    unlinkStudent: {
                        userId: null,
                        learningStreamId: streamId,
                        name: null
                    }
                },
                showModals: {
                    linkStudent: false,
                    unlinkStudent: false,
                },
                paginatorEnable: false
            }
        },
        methods: {
            getDataResponse(data) {
                this.learningStream.id = data.learningStream.id;
                this.learningStream.name = data.learningStream.name;
                this.learningStream.year = data.learningStream.year;
                return {data: data.learningStream.students};
            },
            getDataQuery() {
                return GqlStreams;
            },
            getDataVariables() {
                return {
                    myRelationship: 'director',
                    organizationId: this.organizationId,
                    learningStreamId: this.learningStreamId
                }
            },
            makeData(item) {
                return Object.assign({
                    organizationId: this.organizationId,
                    learningStreamId: this.learningStreamId
                }, this.clearObjectTrick(item));
            },
            linkForm() {
                this.modalsData.linkStudent.streamName = this.learningStream.name + ' (' + this.learningStream.year + ' г.)';
                this.showModals.linkStudent = true;
            },
            unlinkStudent(item) {
                this.modalsData.unlinkStudent = this.makeData(item);
                this.showModals.unlinkStudent = true;
            }
        }
    }

</script>
