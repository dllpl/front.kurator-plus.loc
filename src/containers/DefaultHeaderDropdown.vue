<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      {{fullName}} <slot v-if="getMe.superuser"> <i class="font-weight-bold fas fa-jedi text-danger" title="Вы суперпользователь"></i></slot>
      <img
        :src="gravatarLink"
        class="img-avatar"
        :alt="getMe.email"/>
    </template>
    <template slot="dropdown">
      <b-dropdown-item @click="logout"> Выход</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
    import {HeaderDropdown as AppHeaderDropdown} from '@coreui/vue'
    import auth from "../plugin/auth";
    import avatar from "../plugin/avatar";

    export default {
        name: 'DefaultHeaderDropdown',
        components: {
            AppHeaderDropdown
        },
        data: function () {
            return {
                name: '',
                email: ''
            }
        },
        computed: {
            fullName(){
                let me = this.getMe;
                return [me.name,me.surname,me.patronymic?(me.patronymic.substr(0,1)+'.'):''].filter((item)=>item).join(' ')
            },
            gravatarLink: function () {
                return avatar.gravatarLink(this.email, 35);
            },
            getMe(){
                return this.$store.state.user.me;
            }
        },
        methods: {
            logout: function () {
                auth.logout();
            }
        }
    }
</script>

