<template>
  <div>
    <div class="form-inline">
      <div class="d-inline-block">
        <slot v-if="show">
          <b-select v-model="active.key" :options="options"></b-select>
          <b-input v-model="active.value" v-on:keyup.enter="clickButton"></b-input>
        </slot>
        <slot v-else>
          <div class="pr-3">
            {{filterDataToText}}
          </div>
        </slot>
      </div>
      <button class="btn btn-outline-secondary" @click="clickButton"><i class="fas fa-filter text-dark"></i></button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "custom-filter",
        data() {
            return {
                show: false,
                active: {
                    key: null,
                    value: null
                },
                selected: {
                    key: null,
                    value: null
                },
                options: {
                    null: {value: null, text: 'Нет'},
                    slug: {text: 'Краткое имя', operator: '='},
                    inn: {text: 'ИНН', operator: '='},
                    ogrn: {text: 'ОГРН', operator: '='},
                    name: {text: 'Название', operator: '~'},
                    address: {text: 'Адрес', operator: '~'}
                }
            }
        },
        computed: {
            filterDataToText() {
                if (!this.selected.key || !this.selected.value) {
                    return 'Без фильтрации';
                }
                return this.options[this.selected.key].text + ' ' + this.options[this.selected.key].operator + ' ' + this.selected.value;
            }
        },
        methods: {
            clickButton() {
                if (this.show) {
                    this.selected.key = this.active.key;
                    this.selected.value = this.active.value;
                    let filter = {};
                    filter[this.selected.key] = this.selected.value;
                    this.$emit('loadData', filter);
                } else {
                    this.active.key = this.selected.key;
                    this.active.value = this.selected.value;
                }
                this.show = !this.show
            }
        }
    }
</script>
