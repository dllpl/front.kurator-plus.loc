<script>

    import filter from 'just-filter-object';

    /**
     * простой список - без пагинации
     */
    export default {
        name: "globality-list-lite",
        data() {
            return {
                isBusy: false,
                items: [],
                errors: {
                    query: '',
                    response: {},
                },
                disableSendQuery: false
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getDataQuery(){
                return '';
            },
            getDataResponse(data){
                return data;
            },
            getDataVariables(){
                return {};
            },
            getData(innerData = {}) {
                this.isBusy = true;

                if (this.disableSendQuery) {
                    return;
                }

                innerData = filter(innerData, (key, value) => value);
                innerData = Object.assign(this.getDataVariables(),innerData);

                this.$apollo.query({
                    query: this.getDataQuery(),
                    variables: innerData
                }).then(({errors, data}) => {
                    if (!errors) {
                        this.$set(this, 'items', this.getDataResponse(data));
                    }
                    this.isBusy = false;
                });
            },
        },
    }

</script>
