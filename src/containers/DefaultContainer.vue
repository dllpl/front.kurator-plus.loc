<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile/>

      <b-link class="navbar-brand" to="#">
        <span class="navbar-brand-full">{{smName}}</span>
        <span class="navbar-brand-minimized">{{xsName}}</span>

        <!--        <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">-->
        <!--        <img class="navbar-brand-minimized" src="img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">-->

      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg"/>
      <b-nav-form class="col-md-auto">
        <!--
                <multiselect
                  v-model="selectedRelationshipMainState"
                  :options="relatedOrganizationsOptions"
                  group-values="options"
                  group-label="title"
                  label="title"
                  track-by="key"
                  :searchable="false"
                  :showLabels="false"
                  :allow-empty="false"
                  :hideSelected="true"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <slot v-if="option.key">
                      <strong>{{ option.organizationTitle }}</strong>
                      в роли
                      <strong>{{ option.title }}</strong>
                    </slot>
                    <slot v-else>
                      Главная
                    </slot>
                  </template>
                </multiselect>
        -->
      </b-nav-form>
      <!--        <b-select v-if="false" v-model="selectedRelationshipMainState" @change="goToOrg">-->
      <!--          <option value="null">Главная</option>-->
      <!--          <optgroup :label="organization.name" v-for="organization in relatedOrganizations" :key="organization.id">-->
      <!--            <option v-for="iRelationship in organization.childs" :value="iRelationship.id" :key="iRelationship.id">-->
      <!--              {{iRelationship.relationship.name}}-->
      <!--            </option>-->
      <!--          </optgroup>-->
      <!--        </b-select>-->
      <b-navbar-nav class="d-md-down-none ml-auto">
        <b-nav-item class="d-md-down-none">
          <DefaultHeaderDropdown/>
        </b-nav-item>
      </b-navbar-nav>
      <!--      <AsideToggler class="d-none d-lg-block" />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="menu"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <div class="container-fluid h-100 pt-3 pb-3">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed>
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://coreui.io">{{projectName}}</a>
        <span class="ml-1">&copy; {{releaseYear}} {{author}}.</span>
      </div>
    </TheFooter>
  </div>
</template>

<script>
  import navDefault from '@/nav/parts/default'
  import _navDirector from '@/nav/parts/_director'
  import GoToOrganization from '@/classes/GoToOrganization';

  import {
    Header as AppHeader,
    SidebarToggler,
    Sidebar as AppSidebar,
    SidebarFooter,
    SidebarForm,
    SidebarHeader,
    SidebarMinimizer,
    SidebarNav,
    Aside as AppAside,
    AsideToggler,
    Footer as TheFooter,
    Breadcrumb
  } from '@coreui/vue'
  import DefaultAside from './DefaultAside'
  import DefaultHeaderDropdown from './DefaultHeaderDropdown'
  import Roles from "@/enums/roles";
  import _streamLeader from "@/nav/parts/_streamLeader";

  export default {
    name: 'DefaultContainer',
    components: {
      AsideToggler,
      AppHeader,
      AppSidebar,
      AppAside,
      TheFooter,
      Breadcrumb,
      DefaultAside,
      DefaultHeaderDropdown,
      SidebarForm,
      SidebarFooter,
      SidebarToggler,
      SidebarHeader,
      SidebarNav,
      SidebarMinimizer
    },
    data() {
      return {
        projectName: process.env.VUE_APP_PROJECT_NAME,
        author: process.env.VUE_APP_AUTHOR,
        releaseYear: process.env.VUE_APP_RELEASE_YEAR,
        smName: process.env.VUE_APP_PROJECT_NAME_SM,
        xsName: process.env.VUE_APP_PROJECT_NAME_XS,
        selectedRelationshipMainState: null
      }
    },
    mounted() {
      this.selectedRelationshipMainState = this.defaultSelectedRelationshipId();
    },
    computed: {
      name() {
        return this.$route.name
      },
      list() {
        return this.$route.matched.filter((route) => route.name || route.meta.label)
      },
      relatedOrganizations() {
        let goTo    = new GoToOrganization(this.$router);
        let itemsGr = {};
        this.$store.state.user.me.relatedOrganizations.forEach((v) => {
          if (!goTo.getRouteName(v.relationship.slug, true)) {
            return;
          }
          if (!itemsGr[v.organization.slug]) {
            itemsGr[v.organization.slug]        = v.organization;
            itemsGr[v.organization.slug].childs = {};
          }
          itemsGr[v.organization.slug].childs[v.relationship.slug] = v;
        });
        return itemsGr;
      },
      relatedOrganizationsOptions() {
        let organizations = this.relatedOrganizations;
        let groups        = [];
        for (let organizationK in organizations) {
          let organization = organizations[organizationK];
          let options      = [];

          for (let roleK in organization.childs) {
            let role = organization.childs[roleK];
            options.push({
              title: role.relationship.name,
              organizationTitle: role.organization.name,
              key: role.id,
            });
          }

          groups.push({
            title: organization.name,
            options: options
          })
        }
        return [
          {
            title: null,
            options: [
              {
                title: 'На домашнюю страницу',
                organizationTitle: 'На домашнюю страницу',
                key: null
              }
            ]
          }
        ].concat(groups);
      },
      relationships() {
        return this.$store.state.user.me.relatedOrganizations;
      },
      selectedRelationship() {
        return this.relationshipById(this.selectedRelationshipMainState);
      },
      menu() {
        let menu = null;
        if (this.$route.meta && this.$route.meta.role) {
          menu = this.$route.meta.role;
        }

        const roleItem = new Roles().getObjectByKey(menu);
        if (roleItem && roleItem.tags.some((item) => item === 'directorRoute')) {
          return _navDirector(menu, this.$router, this.$route.params);
        }
        else if (roleItem && roleItem.tags.some((item) => item === 'streamLeaderRoute')) {
          return _streamLeader(menu, this.$router, this.$route.params);
        }
        else {
          return navDefault(this.$router, this.$route.params, this.$store.state.user.me.superuser);
        }
      }
    },
    methods: {
      goToOrg() {
        let item = this.selectedRelationship;
        let goTo = new GoToOrganization(this.$router);
        return goTo.push(item.organization, item.relationship);
      },
      relationshipById(id) {
        return this.relationships.find((item) => item.id === id);
      },
      relationshipByHash(orgainzationId, roleSlug) {
        return this.relationships.find((item) => (item.organization.id === orgainzationId && item.relationship.slug === roleSlug));
      },
      defaultSelectedRelationshipId() {
        if (!this.$route.params.organizationId || !this.$route.meta.role) {
          return null;
        }
        let item = this.relationshipByHash(this.$route.params.organizationId, this.$route.meta.role);
        if (!item) {
          return null;
        }
        return item.id;
      }
    }
  }
</script>
