<template>
    <div class="login">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form ref="loginForm">
                    <v-text-field label="Username" v-model="username" :rules="[rules.required]" @keyup.enter="login"></v-text-field>
                    <PasswordField label="Password" v-model="password" :rules="[rules.required]" @keyup.enter="login"></PasswordField>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <span class="ml-2 error--text font-weight-bold subheading">{{message}}</span>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    v-on:click="login"
                    :loading="isLoggingIn"
                    :disabled="isLoggingIn"
                >Login</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import authService from '@/services/authService';
    import SnackBar, { SnackBarTypes } from '@/components/singleton/SnackBar.vue';
    import PasswordField from '@/components/common/form/PasswordField.vue';

    @Component({
        components: {
            PasswordField,
        },
    })
    export default class Login extends Vue {
        private username: string = '';
        private password: string = '';

        private message: string = '';

        private showPassword: boolean = false;
        private rules = {
            required: (value: string) => !!value || 'Required',
            min: (v: string) => v.length >= 8 || 'Min 8 characters',
        };

        private isLoggingIn = false;

        private async mounted() {
            const resData = await authService.validateApiToken();
            if (resData.success) {
                SnackBar.show('Already logged in.');
                this.goToDashboard();
            }
        }

        private async login() {
            if ((this.$refs.loginForm as any).validate()) {
                this.isLoggingIn = true;

                const resData = await authService.login(this.username, this.password);

                if (resData.success) {
                    SnackBar.show('Logged in successfully', SnackBarTypes.Success);
                    this.goToDashboard();
                } else {
                    SnackBar.show(resData.message, SnackBarTypes.Error);
                }

                this.isLoggingIn = false;
            }
        }

        private goToDashboard() {
            this.$router.push('/dashboard');
        }
    }
</script>
