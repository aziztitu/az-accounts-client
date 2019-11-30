<template>
    <div class="my-account">
        <v-layout wrap>
            <v-flex px-2 xs12 md6 my-2>
                <AccountInfo
                    title="My Account"
                    :accountId="myAccountId"
                    :canEditRole="allowRoleEdit"
                    @accountInfoFetched="onAccountInfoFetched($event)"
                ></AccountInfo>
            </v-flex>

            <v-flex px-2 xs12 md6 my-2>
                <PasswordChanger :accountId="myAccountId"></PasswordChanger>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';
    import SnackBar, { SnackBarOptions, SnackBarTypes } from '@/components/singleton/SnackBar.vue';
    import AccountInfo from '@/components/dashboard/account/AccountInfo.vue';
    import PasswordChanger from '@/components/dashboard/account/PasswordChanger.vue';

    @Component({
        components: {
            AccountInfo,
            PasswordChanger,
        },
    })
    export default class MyAccount extends Vue {
        private myAccountId = SpecialAccountIdentifiers.Me;
        private allowRoleEdit = false;

        private onAccountInfoFetched(accountInfo: any) {
            if (accountInfo) {
                if (accountInfo.role === 'admin') {
                    this.allowRoleEdit = true;
                }
            }
        }
    }
</script>

