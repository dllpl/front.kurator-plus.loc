<script>
    /**
     * Форма в модальном окне
     */
    export default {
        name: "formModal",
        props:['value'],
        model: {
            event: 'show'
        },
        mounted() {
            this._showOrHide(this.isShowModal);
        },
        watch: {
            isShowModal(newValue) {
                this.$emit('show', newValue);
            },
            value(newValue){
                this._showOrHide(newValue);
            }
        },
        data() {
            return {
                isBusy: false,
                isShow: true,
                isShowModal: false,
                model: {
                    // Нужно для хранения исходных данных
                    original: this.getModelFields(),
                    // Нужно для хранения измененных данных
                    dirty: this.getModelFields()
                },
                redirectUrl: '/',
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
                },
            }
        },
        methods: {
            _showOrHide(status) {
                if (status === true) {
                    this.show();
                } else {
                    this.hide();
                }
            },
            // region optional getters
            getModelFields() {
                return {}
            },
            getSubmitQuery() {
                return null
            },
            getSubmitVariables() {
                return this.model.dirty
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
            // endregion

            // region callbacks
            eSaveError(errors) {
                return errors;
            },
            eSaveSuccess() {
                return null;
            },
            eBeforeShow() {
            },
            eAfterShow() {
            },
            eBeforeHide() {
            },
            eAfterHide() {
            },
            // endregion

            getData() {
                this.isBusy = true;
                this.$apollo.query({
                    query: this.getDataQuery(),
                }).then(({errors, data}) => {
                    if (!errors){
                        this.$set(this.model, 'original', this.getDataResponse(data));
                        this.$set(this.model, 'dirty', this.getDataResponse(data));
                    }
                    this.isBusy = false
                });
            },
            onSubmit(evt) {
                this.resetDefaultTrick(evt);
                this.$apollo.mutate({
                    mutation: this.getSubmitQuery(),
                    errorPolicy: 'all',
                    variables: Object.assign({_hideErrors: true}, this.getSubmitVariables()),
                }).then(({errors}) => {
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
                        this.eSaveSuccess();
                    }
                });
            },
            onReset(evt) {
                this.resetOriginal();

                this.resetDefaultTrick(evt);

                this.copyOriginalToDirtyTrick(); // Reset our form values

                // Trick to reset/clear native browser form validation state
                this.validationStateResetTrick();
            },
            show() {
                this.eBeforeShow();
                this.onReset();
                this.isShow = true;
                this.isShowModal = true;
                this.eAfterShow();
            },
            hide() {
                this.eBeforeHide();
                this.onReset();
                this.isShow = false;
                this.isShowModal = false;
                this.eAfterHide();
            },
            resetOriginal(){
                this.$set(this.model, 'original', this.getModelFields());
            },
            // region Tricks
            copyOriginalToDirtyTrick() {
                this.$set(this.model, 'dirty', this.clearObjectTrick(this.model.original));
            },
            resetDefaultTrick(evt) {
                if (evt) {
                    evt.preventDefault();
                }
            },
            validationStateResetTrick() {
                // Trick to reset/clear native browser form validation state
                this.isShow = false;
                this.$nextTick(() => {
                    this.isShow = true
                })
            },
            clearObjectTrick(obj) {
                return JSON.parse(JSON.stringify(obj));
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
