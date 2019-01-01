<template>
    <v-card>
        <v-card-title class="title">
            {{title}}
            <v-spacer></v-spacer>
            <div class="align-center">
                <v-btn
                    :disabled="!canChangePassword"
                    :icon="useIconTools"
                    :loading="changingPassword"
                    @click="changePassword()"
                    :depressed="!useIconTools"
                >
                    <template v-if="useIconTools">
                        <v-tooltip left>
                            <v-icon slot="activator">save</v-icon>Save
                        </v-tooltip>
                    </template>
                    <template v-else>
                        <span key="save">Save</span>
                    </template>

                    <v-progress-circular indeterminate color="accent" size="24" slot="loader"></v-progress-circular>
                </v-btn>
            </div>
        </v-card-title>

        <v-card-text>
            <transition name="slide-down-simple" appear>
                <v-form ref="passwordChangeForm">
                    <PasswordField
                        label="Current Password"
                        v-model="passwordFieldStates.curPassword.password"
                        :errorMessages="passwordFieldStates.curPassword.errorMessages"
                        @input="validateInputs()"
                    ></PasswordField>
                    <PasswordField
                        label="New Password"
                        v-model="passwordFieldStates.newPassword.password"
                        :errorMessages="passwordFieldStates.newPassword.errorMessages"
                        @input="validateInputs()"
                    ></PasswordField>
                    <PasswordField
                        label="Confirm New Password"
                        v-model="passwordFieldStates.newPasswordConfirm.password"
                        :errorMessages="passwordFieldStates.newPasswordConfirm.errorMessages"
                        @input="validateInputs()"
                    ></PasswordField>
                </v-form>
            </transition>
        </v-card-text>
    </v-card>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import PasswordField from '@/components/common/form/PasswordField.vue';
    import { Prop } from 'vue-property-decorator';
    import accountService from '@/services/accountService';
    import SnackBar, { SnackBarTypes } from '@/components/singleton/SnackBar.vue';

    class PasswordFieldState {
        public password: string = '';
        public errorMessages: string[] = [];
    }

    interface PasswordFieldStateCollection {
        curPassword: PasswordFieldState;
        newPassword: PasswordFieldState;
        newPasswordConfirm: PasswordFieldState;
        [key: string]: PasswordFieldState;
    }

    @Component({
        components: {
            PasswordField,
        },
    })
    export default class PasswordChanger extends Vue {

        @Prop({
            type: String,
            default: 'Change Password'
        })
        private title!: string;

        @Prop({
            type: String,
            default: ''
        })
        private accountId!: string;

        @Prop({
            type: Boolean,
            default: true,
        })
        private useIconTools!: boolean;

        private passwordFieldStates: PasswordFieldStateCollection = {
            curPassword: new PasswordFieldState(),
            newPassword: new PasswordFieldState(),
            newPasswordConfirm: new PasswordFieldState(),
        };

        private changingPassword = false;

        private get canChangePassword() {
            if (this.passwordFieldStates.curPassword.password.length === 0
                || this.passwordFieldStates.newPassword.password.length === 0
                || this.passwordFieldStates.newPasswordConfirm.password.length === 0) {
                return false;
            }

            if (!(this.$refs.passwordChangeForm as any).validate()) {
                return false;
            }

            for (const passwordFieldState in this.passwordFieldStates) {
                if (this.passwordFieldStates[passwordFieldState].errorMessages.length > 0) {
                    return false;
                }
            }

            return true;
        }

        private validateInputs() {
            for (const passwordFieldState in this.passwordFieldStates) {
                if (this.passwordFieldStates[passwordFieldState]) {
                    this.passwordFieldStates[passwordFieldState].errorMessages = Array(0);
                }
            }

            if (this.passwordFieldStates.newPassword.password !== this.passwordFieldStates.newPasswordConfirm.password) {
                const errorMsg = `New passwords don't match`;

                // this.passwordFieldStates.newPassword.errorMessages.push(errorMsg);
                this.passwordFieldStates.newPasswordConfirm.errorMessages.push(errorMsg);
                return false;
            }

            return true;
        }

        private async changePassword() {
            if (this.canChangePassword) {
                this.changingPassword = true;

                const resData = await accountService.updatePassword(this.accountId, this.passwordFieldStates.curPassword.password, this.passwordFieldStates.newPassword.password);
                if (resData.success) {
                    SnackBar.show('Password Changed successfully', SnackBarTypes.Success);
                } else {
                    SnackBar.show(resData.message, SnackBarTypes.Error);
                }

                this.changingPassword = false;
            }
        }
    }
</script>
