<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="col">
      {{fio}}
    </div>
    <div class="flex-shrink-1 pr-2">
      <router-link v-if="id" class="btn btn btn-link text-dark"
                   :to="{name:this.$route.meta.role + '-stream-user-update',params:Object.assign(this.$route.params,{id: id})}"
                   title="Редактировать">
        <i class="fas fa-pencil-alt"></i>
      </router-link>
    </div>
    <div class="flex-shrink-1 pr-2">
      <b-button title="Открепить" variant="link" class="pl-10" @click="unlinkStudent"><i class="fas fa-trash-alt"></i>
      </b-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "item",
        props: ['name', 'surname', 'patronymic', 'organizationId', 'learningStreamId', 'id'],
        computed: {
            fio() {
                return [this.surname, this.name, this.patronymic].filter(value => value).join(' ');
            }
        },
        methods: {
            unlinkStudent() {
                this.$emit('unlinkStudent', this.$props);
            },
        }
    }
</script>
