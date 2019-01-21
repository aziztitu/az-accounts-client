<template>
    <div class="accounts">
        <v-card>
            <v-card-title class="title">Accounts
                <v-spacer></v-spacer>

                <v-dialog v-model="createAccountDialogState" max-width="600px">
                    <div slot="activator">
                        <v-tooltip left class="d-flex">
                            <v-btn icon outline color slot="activator">
                                <v-icon>add</v-icon>
                            </v-btn>Add New Account
                        </v-tooltip>
                    </div>

                    <v-form ref="createAccountForm">
                        <v-card>
                            <v-card-title class="title pt-4 pl-4">Create New Account</v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field
                                                label="Name*"
                                                v-model="newAccountInfo.name"
                                                required
                                                :rules="[rules.required]"
                                                :disabled="creatingNewAccount"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field
                                                label="Username*"
                                                v-model="newAccountInfo.username"
                                                required
                                                :rules="[rules.required]"
                                                :disabled="creatingNewAccount"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field
                                                label="Password*"
                                                v-model="newAccountInfo.password"
                                                type="password"
                                                required
                                                :rules="[rules.required]"
                                                :disabled="creatingNewAccount"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field
                                                label="Email*"
                                                v-model="newAccountInfo.email"
                                                required
                                                :rules="[rules.required]"
                                                :disabled="creatingNewAccount"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-select
                                                label="Role*"
                                                :items="allRoles"
                                                item-text="name"
                                                item-value="value"
                                                v-model="newAccountInfo.role"
                                                required
                                                :rules="[rules.required]"
                                                :disabled="creatingNewAccount"
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <small class="left pl-4">*indicates required field</small>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    flat
                                    :disabled="creatingNewAccount"
                                    @click="createAccountDialogState = false"
                                >Close</v-btn>
                                <v-btn
                                    color="primary"
                                    flat
                                    :loading="creatingNewAccount"
                                    @click="createNewAccount()"
                                >Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-dialog>
            </v-card-title>
            <v-divider></v-divider>
            <transition name="slide-down-in-fade-out" mode="out-in">
                <v-expansion-panel
                    v-if="accounts.length > 0"
                    class="full-width"
                    v-model="accountExpansionState"
                    inset
                >
                    <template v-for="(account, index) in accounts">
                        <v-expansion-panel-content :key="index">
                            <div slot="header">
                                <div class="d-flex align-center">
                                    <img
                                        width="36"
                                        height="36"
                                        style="flex-grow: 0 !important"
                                        class="mr-3"
                                        src="https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1"
                                    >
                                    {{account.name}}
                                </div>
                            </div>
                            <div class="px-3">
                                <AccountInfo
                                    title="Edit Account"
                                    v-if="accountInfoStates[index]"
                                    :accountId="account._id"
                                    :forceEditMode="true"
                                    :useIconTools="false"
                                    :canForceUpdatePassword="true"
                                    @accountInfoSaved="(accountInfo) => { account.name = accountInfo.name }"
                                ></AccountInfo>
                            </div>
                        </v-expansion-panel-content>
                    </template>
                </v-expansion-panel>
                <v-progress-linear v-else indeterminate></v-progress-linear>
            </transition>
        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import accountService from '@/services/accountService';
    import { ApiResponseData } from '@/tools/types/api';
    import SnackBar, { SnackBarTypes, SnackBarOptions } from '@/components/singleton/SnackBar.vue';
    import AccountInfo from '@/components/dashboard/account/AccountInfo.vue';
    import { Watch } from 'vue-property-decorator';

    const generateDefaultNewAccount = () => {
        return {
            role: 'user'
        };
    };

    @Component({
        components: {
            AccountInfo,
        },
    })
    export default class Accounts extends Vue {
        private accounts = [];
        private accountExpansionState: any = -1;
        private accountInfoStates: boolean[] = [];

        private createAccountDialogState = false;
        private newAccountInfo: any = generateDefaultNewAccount();
        private creatingNewAccount = false;
        private rules = {
            required: (value: string) => !!value || 'Required',
        };

        private allRoles = [];

        @Watch('accountExpansionState')
        private onAccountEditModesChanged(newExpansionState: any, oldExpansionState: any) {
            this.accountInfoStates[newExpansionState] = true;
        }

        private mounted() {
            this.getAccounts();
            this.getAllRoles();
        }

        private async getAccounts() {
            const resData: ApiResponseData = await accountService.fetchAccounts();

            if (resData.success) {
                this.accounts = resData.accounts;
                this.accountInfoStates = new Array<boolean>(this.accounts.length).fill(false);
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }

        private async getAllRoles() {
            const resData: ApiResponseData = await accountService.fetchAccountRoles();

            if (resData.success) {
                this.allRoles = resData.roles;
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }

        private async createNewAccount() {
            const createAccountForm = (this.$refs.createAccountForm as any);
            if (createAccountForm.validate()) {
                this.creatingNewAccount = true;

                const resData = await accountService.createNewAccount(this.newAccountInfo);
                if (resData.success) {
                    this.newAccountInfo = generateDefaultNewAccount();
                    createAccountForm.resetValidation();
                    this.createAccountDialogState = false;

                    SnackBar.show('New account created successfully', SnackBarTypes.Success);

                    this.getAccounts();
                } else {
                    SnackBar.show(resData.message, SnackBarTypes.Error);
                }

                this.creatingNewAccount = false;
            } else {
                SnackBar.show('Fill in all the required fields.', SnackBarTypes.Error);
            }
        }
    }

</script>
