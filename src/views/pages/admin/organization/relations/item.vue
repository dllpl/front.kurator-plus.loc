<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="w-100">
      <div class="small">
        <div class="mb-2">
          <text-with-label name="Пользователь" :text="fio"/>
          <text-with-label name="Роль" :text="relationship.name"/>
        </div>
      </div>
    </div>
    <div class="flex-shrink-1">
      <button class="btn btn-link text-dark" @click="destroyItem(id)" title="Удалить">
        <i class="fas fa-trash-alt"/>
      </button>
    </div>
  </div>
</template>

<script>
    import TextWithLabel from "~views/globality/textWithLabel";
    import UserHelper from "~classes/Helpers/User";

    export default {
        name: "item",
        components: {TextWithLabel},
        computed: {
            fio() {
                return UserHelper.fioShort(this.user);
            }
        },
        props: {
            id: {type: String},
            user: {type: Object},
            relationship: {type: Object}
        },
        methods: {
            destroyItem: function (id) {
                this.$emit('destroy', id)
            }
        }
    }
</script>
