<template>
  <div class="d-flex p-2 border-top align-items-center">
    <div class="w-100">
      <div>
        <slot v-if="shortName">
          <div>
            <b class="mr-3" v-if="shortName">{{shortName}}</b>
          </div>
          <div>
            <span class="text-muted">{{name}}</span>
          </div>
        </slot>
        <slot v-else>
          <b class="mr-3">{{name}}</b>
        </slot>
      </div>
      <div class="small">
        <div class="mb-2">
          <slot v-if="slug">
            <text-with-label name="Slug" :text="slug"/>
          </slot>
        </div>
        <div class="w-100"></div>
        <slot v-if="inn || ogrn">
          <text-with-label v-if="inn" name="ИНН" :text="inn"/>
          <text-with-label v-if="ogrn" name="ОГРН" :text="ogrn"/>
          <div class="w-100"></div>
        </slot>
        <slot v-if="address">
          <text-with-label name="Адрес" :text="address"/>
        </slot>
      </div>
    </div>
    <div class="flex-shrink-1 pr-2">
      <g-button-link-edit :to="{name:'admin-organization-update',params:{id:id}}"/>
    </div>
    <div class="flex-shrink-1 pr-2">
      <g-button-link-list :to="{name:'admin-organization-users',params:{id:id}}"/>
    </div>
    <div class="flex-shrink-1">
      <g-button-link-delete :to="{name:'admin-organization-destroy',params:{id:id}}"/>
    </div>
  </div>
</template>

<script>
  import TextWithLabel from "~views/globality/textWithLabel";
  import GButtonLinkEdit from "~views/globality/buttons/link/edit";
  import GButtonLinkList from "~views/globality/buttons/link/list";
  import GButtonLinkDelete from "~views/globality/buttons/link/delete";

  export default {
    name: "item",
    components: {GButtonLinkDelete, GButtonLinkList, GButtonLinkEdit, TextWithLabel},
    props: {
      id: {type: String},
      slug: {type: String},
      name: {type: String},
      inn: {type: String},
      shortName: {type: String},
      address: {type: String},
      ogrn: {type: String},
    }
  }
</script>
