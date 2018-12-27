<template>
    <div class="accounts">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-side-icon>
                    <v-icon>people</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-title>Accounts</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-tooltip bottom class="d-flex">
                        <v-btn icon slot="activator">
                            <v-icon>add</v-icon>
                        </v-btn>Add New Account
                    </v-tooltip>
                </v-toolbar-items>
            </v-toolbar>
            <v-list>
                <template v-for="(account, index) in accounts">
                    <v-list-tile :key="account.id" avatar @click>
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
                                    <v-icon>more_vert</v-icon>
                                </v-btn>More Actions
                            </v-tooltip>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="account.id" v-if="index != accounts.length-1"></v-divider>
                </template>
            </v-list>
        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import accountService from '@/services/accountsService';

    @Component({

    })
    export default class Accounts extends Vue {
        private accounts = [];

        private mounted() {
            this.getAccounts();
        }

        private async getAccounts() {
            const response = await accountService.fetchAccounts();
            this.accounts = response.data.accounts;
        }
    }

</script>
