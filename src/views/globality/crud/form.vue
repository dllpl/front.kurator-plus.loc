<script>
    /**
     * Форма на отдельной странице
     */
    export default {
        name: "globality-crud-form",
        data() {
            return {
                isBusy: false,
                show: true,
                model: {
                    // Нужно для хранения исходных данных
                    original: this.getModelFields(),
                    // Нужно для хранения измененных данных
                    dirty: this.getModelFields()
                },
                redirectUrl: '/',
                submitStatus: null,
                errorsMessages: {
                    duplicate: {
                        desired: 'Unique violation',
                        title: 'Запись с такими данными уже существует',
                        type: 'error'
                    },
                    save: {
                        title: 'Сохранить не удалось',
                        type: 'error'
                    }
                }
            }
        },
        methods: {
            getModelFields() {
                return {}
            },
            getSubmitQuery() {
                return null
            },
            getSubmitVariables() {
                return Object.assign({id: this.id}, this.model.dirty)
            },
            getDataQuery() {
                return null
            },
            getDataVariables() {
                return {
                    id: this.id
                }
            },
            getDataResponse(data) {
                return data;
            },
            getData() {
                this.isBusy = true;
                this.$apollo.query({
                    query: this.getDataQuery(),
                    variables: this.getDataVariables()
                }).then(({errors, data}) => {
                    if (!errors) {
                        const innerData = this.getDataResponse(data);
                        if(innerData !== undefined){
                          this.$set(this.model, 'original', innerData);
                          this.$set(this.model, 'dirty', innerData);
                        }
                    }
                    this.isBusy = false
                });
            },
            onSubmit(evt) {
                evt.preventDefault();
                this.submitStatus = 'PENDING';
                this.$apollo.mutate({
                    mutation: this.getSubmitQuery(),
                    errorPolicy: 'all',
                    variables: Object.assign({_hideErrors: true}, this.getSubmitVariables()),
                }).then(({errors,data}) => {
                    if (errors) {
                        errors.forEach((value) => {
                            let errorObject = Object.values(this.errorsMessages).find(item => {
                                return item.desired.indexOf(value.message) >= 0
                            });
                            if (errorObject) {
                                this.nSaveFail(errorObject);
                            } else {
                                this.nSaveFail(this.errorsMessages.save);
                            }
                        });
                        this.eSaveError(errors);
                    } else {
                        this.nSaveSuccess();
                        this.eSaveSuccess(data);
                        this.$router.push(this.redirectUrl);
                    }
                    this.submitStatus = null;
                });
            },
            onReset(evt) {
                evt.preventDefault();

                this.model.dirty = Object.assign({}, this.model.original);// Reset our form values

                // Trick to reset/clear native browser form validation state
                this.show = false;
                this.$nextTick(() => {
                    this.show = true
                })
            },
            // region callbacks
            eSaveError(errors) {
                return errors;
            },
            eSaveSuccess(data) {
                return null;
            },
            // endregion
        },
        notifications: {
            nSaveSuccess: {
                title: 'Сохранено',
                type: 'success'
            },
            nSaveFail: {
                title: 'Сохранить не удалось',
                type: 'error'
            }
        }
    }
</script>
