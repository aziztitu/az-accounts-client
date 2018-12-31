<template>
    <div class="accounts">
        <v-card>
            <v-card-title class="title">Accounts
                <v-spacer></v-spacer>
                <div>
                    <v-tooltip bottom class="d-flex">
                        <v-btn icon outline color slot="activator">
                            <v-icon>add</v-icon>
                        </v-btn>Add New Account
                    </v-tooltip>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <transition name="slide-down-in-fade-out" mode="out-in">
                <v-list v-if="accounts.length > 0">
                    <template v-for="(account, index) in accounts">
                        <v-list-tile :key="account.id" avatar @click=";">
                            <v-list-tile-avatar>
                                <img
                                    src="https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1"
                                >
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title v-html="account.name"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="account.role"></v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-tooltip bottom>
                                    <v-btn icon slot="activator">
                                        <v-icon>edit</v-icon>
                                    </v-btn>Edit
                                </v-tooltip>
                            </v-list-tile-action>
                            <v-list-tile-action>
                                <v-tooltip bottom>
                                    <v-btn icon slot="activator">
                                        <v-icon>delete</v-icon>
                                    </v-btn>Delete
                                </v-tooltip>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="account.id" v-if="index != accounts.length-1"></v-divider>
                    </template>
                </v-list>
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

    @Component({

    })
    export default class Accounts extends Vue {
        private accounts = [];

        private mounted() {
            this.getAccounts();
        }

        private async getAccounts() {
            const resData: ApiResponseData = await accountService.fetchAccounts();

            if (resData.success) {
                this.accounts = resData.accounts;
            } else {
                SnackBar.show(resData.message, SnackBarTypes.Error);
            }
        }
    }

</script>
