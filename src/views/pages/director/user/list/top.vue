<template>
  <div class="row">
    <!--    <highlight-code :lang="'json'">{{this}}</highlight-code>-->
    <div class="col-md-4">
      <div class="d-flex justify-content-start">
        <div>
          <b-select v-model="local.perPage" :options="perPageVariants" @change="changePerPage"></b-select>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="d-flex justify-content-center">
        <b-pagination v-if="local.total > local.perPage"
                      v-model="local.currentPage"

                      :total-rows="local.total"
                      :per-page="local.perPage"

                      class="mb-0"

                      @change="changePage">
        </b-pagination>
      </div>
    </div>
    <div class="col-md-4">
      <div class="d-flex justify-content-end">
        <custom-filter @loadData="setFilter"></custom-filter>
      </div>
    </div>

    <!--<div class="d-flex justify-content-end">
      <div class="ml-2">
        <button class="btn btn-outline-secondary"><i class="fas fa-filter text-dark"></i></button>
      </div>
    </div>-->
  </div>
</template>

<script>
    import CustomFilter from "./filter";

    export default {
        components: {CustomFilter},
        inheritAttrs: false,
        name: "top",
        props: {
            count: {
                default: 0,
                type: Number
            },
            countS: {
                default: 0,
                type: Number
            },
            currentPage: {
                default: 1,
                type: Number
            },
            firstItem: {
                default: 0,
                type: Number
            },
            total: {
                default: 0,
                type: Number
            },
            perPage: {
                default: 5,
                type: Number
            }
        },
        data() {
            return {
                local: {
                    count: this.count,
                    currentPage: this.currentPage,
                    total: this.total,
                    perPage: this.perPage,
                },
                perPageVariants: [
                    // {value: 1, text: 1},
                    {value: 5, text: 5},
                    {value: 10, text: 10},
                    {value: 25, text: 25},
                    {value: 50, text: 50},
                    {value: 100, text: 100},
                ]
            }
        },
        methods: {
            changePage(value) {
                this.local.currentPage = value;
                this.loadData();
            },
            changePerPage(value) {
                this.local.perPage = value;
                this.local.currentPage = 1;
                this.loadData();
            },
            setFilter(custom = {}) {
                this.local.currentPage = 1;
                this.loadData(custom);
            },
            loadData(custom = {}) {
                custom = Object.assign({page: this.local.currentPage, first: this.local.perPage}, custom);
                this.$emit('loadData', custom);
            }
        },
        watch: {
            count(value) {
                this.local.count = value;
            },
            perPage(value) {
                this.local.perPage = value;
            },
            total(value) {
                this.local.total = value;
            }
        }
    }
</script>
