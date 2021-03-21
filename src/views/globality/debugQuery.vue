<template>
  <!-- The modal -->
  <b-modal v-model="visible" size="lg" :ref="refName" :title="title" hide-footer scrollable
           :header-bg-variant="variant">
    <h4>Запрос</h4>
    <pre class="border border-success p-2">{{query}}</pre>
    <h4 class="mt-5">Ответ</h4>
    <pre class="border border-warning p-2">{{response}}</pre>
  </b-modal>
</template>

<script>
    export default {
        inheritAttrs: false,
        name: "debugQuery",
        props: {
            query: {},
            response: {},
            visible: {
                default: false,
                type: Boolean
            },
            refName: {
                default: function () {
                    if (!this.refName) {
                        return this.$options.name + 'Modal'
                    }
                    return this.refName;
                },
                type: String
            },
            variant: {
                default: 'danger',
                type: String
            },
            title: {
                default: function () {
                    if (!this.title) {
                        if (this.variant !== 'danger') {
                            return 'Информация о запросе'
                        } else {
                            return 'Ошибка в запросе'
                        }
                    }
                    return this.title;
                },
                type: String
            }
        },
        data(){
            return {
                visibleLocal:this.visible
            }
        }
    }
</script>
