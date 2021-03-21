<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="w-100">
      <div class="small">
        <div class="mb-2">
          <text-with-label name="Организация" :text="organization.name"></text-with-label>
          <text-with-label name="Роль" :text="relationship.name"></text-with-label>
        </div>
      </div>
    </div>
    <div class="flex-shrink-1">
      <button class="btn btn-link text-dark" @click="destroyItem(id)" title="Удалить">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </div>
</template>

<script>
    import TextWithLabel from "~views/globality/textWithLabel";

    export default {
        name: "item",
        components: {TextWithLabel},
        props: {
            'id': {type: String},
            organization: {type: Object},
            relationship: {type: Object}
        },
        methods: {
            destroyItem: function (id) {
                this.$emit('destroy', id)
            }
        }
    }
</script>
