<template>
    <div class="my-account">
        <v-layout>
            <v-flex class="px-2 xs6">
                <AccountInfo title="My Account" :accountId="myAccountId"></AccountInfo>
            </v-flex>

            <v-flex class="px-2 xs6">
                <!-- <v-card>
                    <v-toolbar class="primary" dark>
                        <v-toolbar-title>Change Password</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items class="align-center">
                            <v-progress-circular
                                v-if="savingAccountInfo"
                                indeterminate
                                color="accent"
                            ></v-progress-circular>
                            <v-btn v-else icon @click="toggleEditAccountInfo()">
                                <transition name="fade-simple" appear mode="out-in">
                                    <v-tooltip v-if="editAccountInfo" key="save" left>
                                        <v-icon slot="activator">save</v-icon>Save
                                    </v-tooltip>
                                    <v-tooltip v-else key="edit" left>
                                        <v-icon slot="activator">edit</v-icon>Edit
                                    </v-tooltip>
                                </transition>
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                </v-card> -->
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';
    import SnackBar, { SnackBarOptions, SnackBarTypes } from '@/components/singleton/SnackBar.vue';
    import AccountInfo from '@/components/dashboard/AccountInfo.vue';

    @Component({
        components: {
            AccountInfo,
        },
    })
    export default class MyAccount extends Vue {
        private myAccountId = SpecialAccountIdentifiers.Me;
    }
</script>

