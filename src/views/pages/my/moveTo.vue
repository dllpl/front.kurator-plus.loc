<template>
    <b-card no-body>
      <b-card-body>
        <busy v-if="isBusy"></busy>
        <slot v-else>
          <div v-for="role in items" v-if="successRoles(role.slug)">
            <h4>{{role.name}}</h4>
            <div v-for="organization in role.children">
              <router-link :to="getRoute(role.slug,organization.id)" class="btn btn-link">
                {{organization.name}}
              </router-link>
            </div>
          </div>
        </slot>
      </b-card-body>
    </b-card>
</template>

<script>
    import Busy from "~views/globality/busy";
    import GlobalList from "~views/globality/crud/listLite";
    import QueryRelatedOrganizations from "~gql/me/queryRelatedOrganizations.graphql";
    import Roles from "@/enums/roles";

    export default {
        name: "moveTo",
        extends: GlobalList,
        components: {Busy},
        data() {
            return {
                items: [],
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            successRoles(role) {
                let object = new Roles().getObjectByKey(role);
                if(object){
                    return object.tags.some((item)=> item === 'goTo');
                }
                return false;
            },
            getRoute(role, id) {
                let object = new Roles().getObjectByKey(role);
                if(object && object.tags.some((item)=> item === 'goTo')){
                    return {name: role+'-dashboard', params: {organizationId: id}};
                }
                return null;
            },
            getDataResponse(data) {
                let inData = data.me.relatedOrganizations;
                let array = {};
                for (let inDataKey in inData) {
                    if (inData.hasOwnProperty(inDataKey)) {
                        let element = inData[inDataKey];
                        let relationship = element.relationship;
                        let organization = element.organization;
                        if (!array[relationship.slug]) {
                            array[relationship.slug] = Object.assign({children: []}, relationship);
                            array[relationship.slug] = Object.assign({children: []}, relationship);
                        }
                        array[relationship.slug].children.push(organization);
                    }
                }
                return array;
            },
            getDataQuery() {
                return QueryRelatedOrganizations;
            },
        }
    }

</script>
