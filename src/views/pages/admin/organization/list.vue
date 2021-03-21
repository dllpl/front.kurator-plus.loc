<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <top @loadData="getData"
             :per-page="paginator.perPage"
             :first-item="paginator.firstItem"
             :total="paginator.total" class="border-bottom pb-3"/>
        <div class="pt-3">
          <g-btn-create to="organization/create"/>
        </div>
      </b-card-header>
      <b-card-body>
        <busy v-if="isBusy"/>
        <slot v-else>
          <div class="p-2">
            Найдено записей: {{paginator.total}}
          </div>
          <list-item v-for="item in items" v-bind:key="item.id" v-bind="item"/>
        </slot>
      </b-card-body>
    </b-card>
  </div>

</template>

<script>
    import Top from "./list/top";
    import CustomFilter from "./list/filter";
    import GBtnCreate from "~views/globality/buttons/create";
    import Busy from "~views/globality/busy";
    import ListItem from "./list/item";
    import GlobalList from "~views/globality/crud/list";
    import QueryOrganization from "~gql/organization/queryOrganizations.graphql";

    export default {
        name: "list",
        extends: GlobalList,
        components: {ListItem, GBtnCreate, CustomFilter, Busy, Top},
        data() {
            return {
                items: [],
            }
        },
        methods:{
            getDataResponse(data){
                return data.organizations;
            },
            getDataQuery(){
                return QueryOrganization;
            },
        }
    }

</script>
