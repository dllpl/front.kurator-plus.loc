<script>
    import filter from 'just-filter-object';

    /**
     * Список с пагинацией
     */
    export default {
        name: "globality-list",
        data() {
            return {
                isBusy: false,
                paginator: {
                    count: 0,
                    currentPage: 1,
                    firstItem: 0,
                    total: 0,
                    perPage: 100,
                },
                items: [],
                errors: {
                    query: '',
                    response: {},
                },
                disableSendQuery: false,
                perPageVariants: [
                    {value: 5, text: 5},
                    {value: 10, text: 10},
                    {value: 25, text: 25},
                    {value: 50, text: 50},
                    {value: 100, text: 100},
                ],
                paginatorEnable: true
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getDataQuery() {
                return '';
            },
            getDataResponse(data) {
                return data;
            },
            getDataVariables() {
                return {};
            },
            getData(innerData = {}) {
                this.isBusy = true;

                if (this.disableSendQuery) {
                    return;
                }

                if (this.paginatorEnable) {
                    if (innerData.first !== undefined) {
                        this.paginator.perPage = innerData.first;
                    }

                    if (innerData.page !== undefined) {
                        this.paginator.currentPage = innerData.page;
                    }
                }

                if(!innerData.perPage){
                  innerData.first = this.paginator.perPage;
                }
                innerData = filter(innerData, (key, value) => value);
                innerData = Object.assign(this.getDataVariables(), innerData);

                this.$apollo.query({
                    query: this.getDataQuery(),
                    variables: innerData
                }).then(({errors, data}) => {
                    if (!errors) {
                        const dataResponse = this.getDataResponse(data);
                        this.$set(this, 'items', dataResponse.data);
                        if (this.paginatorEnable) {
                            this.$set(this, 'paginator', dataResponse.paginatorInfo);
                        }
                    }
                    this.isBusy = false;
                });
            },
            clearObjectTrick(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        },
    }

</script>
