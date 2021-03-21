<template>
  <div>
    <b-card no-body>
      <b-card-header v-if="false">
          <top @loadData="getData"
             :per-page="paginator.perPage"
             :first-item="paginator.firstItem"
             :total="paginator.total" class="border-bottom pb-3"></top>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"></busy>
        <slot v-else>
          <div v-if="false" class="p-2">
            Найдено записей: {{paginator.total}}
          </div>
          <list-item
            v-for="item in items"
            @updateListData="getData"
            v-if="item.leaders[0] && item.leaders[0].id === me.id"

            v-bind:key="item.id"
            v-bind:organizationId="organizationId"
            v-bind="toItemConverter(item)"
          />
        </slot>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
    import Top from "./list/top";
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./list/item";
    import GlobalList from "~views/globality/crud/list";

    import GqlStreams from '~gql/streams/list.graphql';

    export default {
        name: "list",
        extends: GlobalList,
        components: {ListItem, GBtnCreate, Busy, Top},
        data() {
            let orgId = this.$route.params.organizationId;
            return {
                items: [],
                organizationId: orgId,
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
                    organizationId: this.organizationId,
                    myRelationship: 'stream_leader'
                }
            },
            clearObjectTrick(obj) {
                return JSON.parse(JSON.stringify(obj));
            },
            makeData(item) {
                return Object.assign({organizationId: this.organizationId}, this.clearObjectTrick(item));
            }

        },
      computed: {
        me() {
          return this.$store.state.user.me
        },
      }
    }

</script>
