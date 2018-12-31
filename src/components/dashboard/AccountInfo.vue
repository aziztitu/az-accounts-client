<template>
    <v-card>
        <v-card-title class="title">
            {{title}}
            <v-spacer></v-spacer>
            <div class="align-center">
                <v-btn
                    v-if="accountInfo"
                    icon
                    class="ma-0"
                    :loading="savingAccountInfo"
                    @click="toggleEditAccountInfo()"
                >
                    <transition name="fade-simple" appear mode="out-in">
                        <v-tooltip v-if="editAccountInfo" key="save" left>
                            <v-icon slot="activator">save</v-icon>Save
                        </v-tooltip>
                        <v-tooltip v-else key="edit" left>
                            <v-icon slot="activator">edit</v-icon>Edit
                        </v-tooltip>
                    </transition>

                    <v-progress-circular
                        v-if="savingAccountInfo"
                        indeterminate
                        color="accent"
                        size="24"
                        slot="loader"
                    ></v-progress-circular>
                </v-btn>
            </div>
        </v-card-title>

        <v-card-text>
            <transition name="slide-down-in-fade-out" mode="out-in">
                <v-form v-if="accountInfo">
                    <v-text-field
                        label="Name"
                        v-model="accountInfo.name"
                        :disabled="!editAccountInfo"
                    ></v-text-field>
                    <v-text-field
                        label="Username"
                        v-model="accountInfo.username"
                        :disabled="!editAccountInfo"
                    ></v-text-field>
                    <v-select
                        label="Role"
                        :items="allRoles"
                        item-text="name"
                        item-value="value"
                        v-model="accountInfo.role"
                        disabled
                    ></v-select>
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
    import SnackBar, { SnackBarTypes } from '@/components/singleton/SnackBar.vue';
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';
    import { Prop } from 'vue-property-decorator';

    @Component({
    })
    export default class MyAccountInfo extends Vue {
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


        private allRoles = [];

        private accountInfo: any = null;

        private editAccountInfo = false;
        private savingAccountInfo = false;

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
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }

        private async toggleEditAccountInfo() {
            if (this.editAccountInfo) {
                if (this.accountInfo) {
                    this.savingAccountInfo = true;

                    const resData = await accountService.updateAccountInfo(this.accountId, {
                        username: this.accountInfo!.username,
                        name: this.accountInfo!.name,
                    });

                    if (resData.success) {
                        this.editAccountInfo = false;
                        SnackBar.show('Account Info Saved', SnackBarTypes.Success);
                    } else {
                        SnackBar.show(resData.message, SnackBarTypes.Error);
                    }

                    this.savingAccountInfo = false;
                }
            } else {
                this.editAccountInfo = true;
            }
        }
    }
</script>

