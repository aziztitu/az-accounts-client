<template>
    <v-card>
        <v-card-title class="title">
            {{title}}
            <v-spacer></v-spacer>
            <div class="align-center">
                <v-btn
                    v-if="accountInfo"
                    :icon="useIconTools"
                    class="ma-0"
                    :loading="savingAccountInfo"
                    @click="toggleEditAccountInfo()"
                    :depressed="!useIconTools"
                    :color="toolButtonColor"
                >
                    <template v-if="useIconTools">
                        <transition name="fade-simple" appear mode="out-in">
                            <v-tooltip v-if="isInEditMode" key="save" left>
                                <v-icon slot="activator">save</v-icon>Save
                            </v-tooltip>
                            <v-tooltip v-else key="edit" left>
                                <v-icon slot="activator">edit</v-icon>Edit
                            </v-tooltip>
                        </transition>
                    </template>
                    <template v-else>
                        <transition name="fade-simple" appear mode="out-in">
                            <span v-if="isInEditMode" key="save">Save</span>
                            <span v-else key="edit">Edit</span>
                        </transition>
                    </template>

                    <v-progress-circular indeterminate color="accent" size="24" slot="loader"></v-progress-circular>
                </v-btn>
            </div>
        </v-card-title>

        <v-card-text>
            <transition name="slide-down-in-fade-out" mode="out-in">
                <v-form v-if="accountInfo">
                    <v-text-field label="Name" v-model="accountInfo.name" :disabled="!isInEditMode"></v-text-field>
                    <v-text-field
                        label="Username"
                        v-model="accountInfo.username"
                        :disabled="!isInEditMode"
                    ></v-text-field>
                    <v-text-field
                        label="Email"
                        type="email"
                        v-model="accountInfo.email"
                        :disabled="!isInEditMode"
                    ></v-text-field>
                    <v-select
                        label="Role"
                        :items="allRoles"
                        item-text="name"
                        item-value="value"
                        v-model="accountInfo.role"
                        :disabled="!isInEditMode || !canEditRole"
                    ></v-select>
                    <PasswordField
                        v-if="canForceUpdatePassword"
                        v-model="accountInfo.password"
                        label="New Password"
                        :disabled="!isInEditMode"
                    ></PasswordField>
                </v-form>
                <div v-else>
                    <v-progress-linear indeterminate></v-progress-linear>
                </div>
            </transition>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import SnackBar, { SnackBarTypes, SnackBarOptions } from '@/components/singleton/SnackBar.vue';
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';
    import { Prop } from 'vue-property-decorator';
    import PasswordField from '@/components/common/form/PasswordField.vue';

    @Component({
        components: {
            PasswordField,
        }
    })
    export default class AccountInfo extends Vue {
        @Prop({
            type: String,
            default: 'Account Info'
        })
        private title!: string;

        @Prop({
            type: String,
            default: ''
        })
        private accountId!: string;

        @Prop({
            type: Boolean,
            default: false,
        })
        private forceEditMode!: boolean;

        @Prop({
            type: Boolean,
            default: true,
        })
        private useIconTools!: boolean;

        @Prop({
            type: Boolean,
            default: true,
        })
        private canEditRole!: boolean;

        @Prop(Boolean)
        private canForceUpdatePassword!: boolean;


        private allRoles = [];

        private accountInfo: any = null;

        private editAccountInfo = false;
        private savingAccountInfo = false;

        private get isInEditMode() {
            return this.forceEditMode || this.editAccountInfo;
        }

        private get toolButtonColor() {
            return this.useIconTools ? '' : 'primary';
        }

        public async mounted() {
            this.getAllRoles();
            this.getAccountInfo();
        }

        private async getAllRoles() {
            const resData = await accountService.fetchAccountRoles();
            if (resData.success) {
                this.allRoles = resData.roles;
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }

        private async getAccountInfo() {
            const resData = await accountService.fetchBasicAccountInfo(this.accountId);
            if (resData.success) {
                this.accountInfo = resData.accountInfo;
                this.accountInfo.password = '';

                this.$emit('accountInfoFetched', this.accountInfo);
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }

        private toggleEditAccountInfo() {
            if (this.isInEditMode) {
                if (this.accountInfo) {
                    this.saveAccountInfo();
                }
            } else {
                this.editAccountInfo = true;
            }
        }

        private async saveAccountInfo() {
            this.savingAccountInfo = true;

            const resData = await accountService.updateAccountInfo(this.accountId, this.accountInfo);

            if (resData.success) {
                this.editAccountInfo = false;
                this.accountInfo.password = '';

                SnackBar.show('Account Info Saved', SnackBarTypes.Success);
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }

            this.savingAccountInfo = false;
        }
    }
</script>

