<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="col pr-2 text-nowrap text-black-50 mr-2">
      <i class="fas fa-user-graduate" title="Учеников"></i> {{studentsSize}}
    </div>
    <div class="col">
      <b class="align-middle text-center">
        <div class="small text-black-50 text-center">{{year}}</div>
        <div class="text-center">{{name}}</div>
      </b>
    </div>
    <div class="flex-shrink-1 w-100 h-100">
      <slot v-if="leader">
        {{fio(leader).join(' ')}}
      </slot>
      <slot v-else>
        Классный руководитель на закреплён
      </slot>
    </div>
    <div class="flex-shrink-1 pr-2">
      <b-button class="text-dark" variant="link" title="Список учеников" :to="routeStream">
        <i class="far fa-list-alt"></i>
      </b-button>
    </div>
  </div>
</template>

<script>
    import TextWithLabel from "~views/globality/textWithLabel";

    export default {
        name: "item",
        components: {TextWithLabel},
        computed: {
            routeStream() {
                return {name: this.$route.meta.role + '-stream-user', params: this.routeProps};
            },
            routeProps() {
                return {organizationId: this.organizationId, learningStreamId: this.id}
            }
        },
        methods: {
            fio(item) {
                return [item.name, item.surname, item.patronymic].filter(value => value);
            }
        },
        props: {
            id: {type: String},
            organizationId: {type: String},
            name: {type: String},
            year: {type: Number},
            leader: {type: Object},
            studentsSize: {type: Number, default: 0},
        },
    }
</script>
