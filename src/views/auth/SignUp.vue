<template>
    <div class="sign-up">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Sign Up</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="title font-weight-regular">
                <br/>
                <span>Creating Account Independently is not yet allowed.</span>
                <br/>
                <br/>
                <span>Ask the admin to create an account for you.</span>
            </v-card-text>

            <v-card-actions>
                <!-- <span class="ml-2 error--text font-weight-bold subheading">{{message}}</span> -->
                <v-spacer></v-spacer>
                <!-- <v-btn color="primary" v-on:click="signUp()">Sign Up</v-btn> -->
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component
    export default class SignUp extends Vue {

    }
</script>