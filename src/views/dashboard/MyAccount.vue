<template>
    <div class="my-account">
        <v-card>
            <v-toolbar class="primary" dark>
                <v-toolbar-title>My Account</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon @click="toggleEditAccountInfo()">
                        <transition name="fade-simple" appear mode="out-in">
                            <v-tooltip v-if="editAccountInfo" key="save" left>
                                <v-icon slot="activator">save</v-icon>
                                Save
                            </v-tooltip>
                            <v-tooltip v-else key="edit" left>
                                <v-icon slot="activator">edit</v-icon>
                                Edit
                            </v-tooltip>
                        </transition>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
                <v-form v-if="accountInfo">
                    <v-text-field
                        label="Name"
                        :value="accountInfo.name"
                        :disabled="!editAccountInfo"
                    ></v-text-field>
                    <v-text-field
                        label="Username"
                        :value="accountInfo.username"
                        :disabled="!editAccountInfo"
                    ></v-text-field>
                    <v-select
                        label="Role"
                        :items="allRoles"
                        item-text="name"
                        item-value="value"
                        :value="accountInfo.role"
                        disabled
                    ></v-select>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';

    @Component
    export default class MyAccount extends Vue {
        private allRoles = [];

        private accountInfo = null;

        private editAccountInfo = false;

        public async mounted() {
            this.getAllRoles();
            this.getAccountInfo();
        }

        private async getAllRoles() {
            const resData = await accountService.fetchAccountRoles();
            if (resData.success) {
                this.allRoles = resData.roles;
            }
        }

        private async getAccountInfo() {
            const resData = await accountService.fetchBasicAccountInfo(SpecialAccountIdentifiers.Me);
            if (resData.success) {
                this.accountInfo = resData.accountInfo;
            }
        }

        private toggleEditAccountInfo() {
            if (this.editAccountInfo) {
                // TODO: Save Account Info (possibly, only if modified)

                this.editAccountInfo = false;
            } else {
                this.editAccountInfo = true;
            }
        }
    }
</script>

