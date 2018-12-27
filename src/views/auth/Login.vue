<template>
  <div class="login">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field label="Username" v-model="username" :rules="[rules.required]"></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            counter
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <span class="ml-2 error--text font-weight-bold subheading">{{message}}</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-on:click="login()">Login</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import authService from '@/services/authService';

@Component
export default class Login extends Vue {
  private username: string = '';
  private password: string = '';

  private message: string = '';

  private showPassword: boolean = false;
  private rules = {
    required: (value: string) => !!value || 'Required',
    min: (v: string) => v.length >= 8 || 'Min 8 characters',
  };

  private async mounted() {
    const resData = await authService.validateApiToken();
    if (resData.success) {
      this.goToDashboard();
    }
  }

  private async login() {
    if ((this.$refs.loginForm as any).validate()) {
      const resData = await authService.login(this.username, this.password);

      this.message = resData.message;

      if (resData.success) {
        this.goToDashboard();
      }
    }
  }

  private goToDashboard() {
    this.$router.push('/dashboard');
  }
}
</script>
