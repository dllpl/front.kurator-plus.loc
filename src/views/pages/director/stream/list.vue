<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <top @loadData="getData"
             :per-page="paginator.perPage"
             :first-item="paginator.firstItem"
             :total="paginator.total" class="border-bottom pb-3"/>
        <div class="pt-3">
          <button class="btn btn-success" @click="createForm">Создать</button>
        </div>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"/>
        <slot v-else>
          <div class="p-2">
            Найдено записей: {{paginator.total}}
          </div>
          <list-item
            v-for="item in items"

            @updateListData="getData"
            @unlinkLeader="unlinkLeader"
            @linkLeader="linkLeader"
            @update="updateForm"
            @destroy="destroyForm"

            v-bind:key="item.id"
            v-bind:organizationId="organizationId"
            v-bind="toItemConverter(item)"
          />
        </slot>
      </b-card-body>
    </b-card>
    <create-modal v-model="showModals.create" @updateListData="getData" v-bind="modalsData.create"/>
    <update-modal v-model="showModals.update" @updateListData="getData" v-bind="modalsData.update"/>
    <destroy-modal v-model="showModals.destroy" @updateListData="getData" v-bind="modalsData.destroy"/>
    <set-leader-modal v-model="showModals.linkLeader" @updateListData="getData" v-bind="modalsData.linkLeader">
    </set-leader-modal>
  </div>
</template>

<script>
    import Top from "./list/top";
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./list/item";
    import GlobalList from "~views/globality/crud/list";
    import CreateModal from './modals/create';

    import GqlStreams from '~gql/streams/list.graphql';
    import GqlUnlinkLeader from '~gql/streams/users/unlinkLeader.graphql';

    import SetLeaderModal from "~views/pages/director/stream/modals/setLeader";
    import UpdateModal from "~views/pages/director/stream/modals/update";
    import DestroyModal from "~views/pages/director/stream/modals/destroy";

    export default {
        name: "list",
        extends: GlobalList,
        components: {DestroyModal, UpdateModal, SetLeaderModal, ListItem, GBtnCreate, Busy, Top, CreateModal},
        data() {
            let orgId = this.$route.params.organizationId;
            return {
                items: [],
                organizationId: orgId,
                modalsData: {
                    linkLeader: {
                        organizationId: orgId,
                        learningStreamId: null,
                        streamName: null
                    },
                    create: {
                        organizationId: orgId,
                    },
                    update: {
                        learningStreamId: null,
                        name: null,
                        year: null,
                        organizationId: orgId,
                    },
                    destroy: {
                        learningStreamId: null,
                        name: null,
                        year: null,
                        organizationId: orgId,
                    }
                },
                showModals: {
                    create: false,
                    linkLeader: false,
                    update: false,
                    destroy: false,
                },
            }
        },
        methods: {
            itemById(id) {
                return this.items.find((item) => item.id === id)
            },
            indexById(id) {
                return this.items.indexOf((item) => item.id === id)
            },
            toItemConverter(item) {
                return {
                    id: item.id,
                    organizationId: {type: String},
                    name: item.name,
                    year: parseInt(item.year),
                    studentsSize: item.students.length,
                    leader: item.leaders.find(() => true)
                }
            },
            getDataResponse(data) {
                return data.organization.learningStreams;
            },
            getDataQuery() {
                return GqlStreams;
            },
            getDataVariables() {
                return {
                    organizationId: this.organizationId
                }
            },
            createForm() {
                this.modalsData.create.organizationId = this.organizationId;
                this.showModals.create = true;
            },
            updateForm(streamId) {
                this.$set(this.modalsData,'update',this.makeData(this.itemById(streamId)));
                this.showModals.update = true;
            },
            destroyForm(streamId) {
                this.$set(this.modalsData,'destroy',this.makeData(this.itemById(streamId)));
                this.showModals.destroy = true;
            },
            unlinkLeader(streamId, userId) {
                this.$apollo.mutate({
                    mutation: GqlUnlinkLeader,
                    variables: {
                        learningStreamId: streamId,
                        userId: userId
                    }
                }).then(() => {
                    this.getData();
                });
            },
            linkLeader(streamId) {
                this.modalsData.linkLeader.organizationId = this.organizationId;
                this.modalsData.linkLeader.learningStreamId = streamId;
                this.modalsData.linkLeader.streamName = this.itemById(streamId).name;
                this.showModals.linkLeader = true;
            },
            clearObjectTrick(obj) {
                return JSON.parse(JSON.stringify(obj));
            },
            makeData(item) {
                return Object.assign({organizationId: this.organizationId}, this.clearObjectTrick(item));
            }

        }
    }

</script>
