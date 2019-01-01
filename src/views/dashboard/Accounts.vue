<template>
    <div class="accounts">
        <v-card>
            <v-card-title class="title">Accounts
                <v-spacer></v-spacer>
                <div>
                    <v-tooltip left class="d-flex">
                        <v-btn icon outline color slot="activator">
                            <v-icon>add</v-icon>
                        </v-btn>Add New Account
                    </v-tooltip>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <transition name="slide-down-in-fade-out" mode="out-in">
                <v-expansion-panel v-if="accounts.length > 0" class="full-width" v-model="accountExpansionState" inset>
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
    import SnackBar, { SnackBarTypes } from '@/components/singleton/SnackBar.vue';
    import AccountInfo from '@/components/dashboard/account/AccountInfo.vue';
    import { Watch } from 'vue-property-decorator';

    @Component({
        components: {
            AccountInfo,
        },
    })
    export default class Accounts extends Vue {
        private accounts = [];
        private accountExpansionState: any = -1;
        private accountInfoStates: boolean[] = [];

        @Watch('accountExpansionState')
        private onAccountEditModesChanged(newExpansionState: any, oldExpansionState: any) {
            this.accountInfoStates[newExpansionState] = true;
        }

        private mounted() {
            this.getAccounts();
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
    }

</script>
