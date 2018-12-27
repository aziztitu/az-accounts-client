<template>
    <div id="dashboard">
        <NavToolbar>
            <template slot="hamburgerHolder">
                <!-- <v-btn icon @click.stop="collapseNavDrawer = !collapseNavDrawer">
                    <v-icon v-if="collapseNavDrawer">menu</v-icon>
                    <v-icon v-else>chevron_left</v-icon>
                </v-btn>-->
            </template>

            <v-btn class="primary" flat v-on:click="logout()">Logout</v-btn>
        </NavToolbar>

        <transition name="nav-drawer" appear>
            <v-hover>
                <v-navigation-drawer
                    app
                    floating
                    :disable-resize-watcher="true"
                    permanent
                    hide-overlay
                    :mini-variant="collapseNavDrawer && !hover"
                    id="navDrawer"
                    slot-scope="{ hover }"
                    class="mt-5"
                    style="top: 16px; margin-bottom: 32px"
                >
                    <v-toolbar flat class="secondary" dark height="48px">
                        <v-list class="pa-0">
                            <v-list-tile @click.stop="collapseNavDrawer = !collapseNavDrawer">
                                <v-list-tile-action>
                                    <v-btn icon>
                                        <transition name="fade-simple" appear mode="out-in">
                                            <v-icon
                                                v-if="collapseNavDrawer && !hover"
                                                key="menu"
                                            >menu</v-icon>
                                            <v-icon
                                                v-else-if="collapseNavDrawer && hover"
                                                key="pin"
                                            >vertical_align_bottom</v-icon>
                                            <v-icon v-else key="unpin">cancel</v-icon>
                                        </transition>
                                    </v-btn>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{collapseNavDrawer?"Pin":"Unpin"}} Navigation Drawer</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-toolbar>

                    <v-list class="pt-2">
                        <router-link
                            to="../profile"
                            tag="v-list-tile"
                            append
                        >
                            <v-list-tile-avatar>
                                <img
                                    src="https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1"
                                >
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>Profile Name</v-list-tile-title>
                            </v-list-tile-content>
                        </router-link>

                        <div v-for="(navRouterLinkGroup, index) in navRouterLinks" :key="index">
                            <v-divider></v-divider>
                            <router-link
                                v-for="navRouterLink in navRouterLinkGroup"
                                :key="navRouterLink.title"
                                :to="navRouterLink.to"
                                tag="v-list-tile"
                                append
                            >
                                <v-list-tile-action>
                                    <v-btn icon>
                                        <v-icon medium>{{navRouterLink.icon}}</v-icon>
                                    </v-btn>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{navRouterLink.title}}</v-list-tile-title>
                                </v-list-tile-content>
                            </router-link>
                        </div>
                    </v-list>
                </v-navigation-drawer>
            </v-hover>
        </transition>

        <v-content class="dashboard-content">
            <v-container class="dashboard-container" fluid>
                <v-layout class="dashboard-layout" row justify-center>
                    <v-flex>
                        <transition name="router-view-switch-default" appear mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer app>
            <v-container pa-0>
                <v-layout>
                    <v-flex>Made with ❤️ by Azee</v-flex>
                    ©️ {{ new Date().getFullYear() }}
                </v-layout>
            </v-container>
        </v-footer>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import store from '@/store';
    import NavToolbar from '@/components/common/navigation/NavToolbar.vue';
    import authService from '@/services/authService';

    interface NavRouterLink {
        to: string;
        icon: string;
        title: string;
        addDivider?: boolean;
    }

    @Component({
        components: {
            NavToolbar,
        },
    })
    export default class Dashboard extends Vue {
        private collapseNavDrawer = true;

        private navRouterLinks: NavRouterLink[][] = [
            [
                {
                    to: '../home',
                    icon: 'home',
                    title: 'Home',
                },
                {
                    to: '../accounts',
                    icon: 'people',
                    title: 'Accounts',
                },
            ],
            [
                {
                    to: '../about',
                    icon: 'info',
                    title: 'About',
                },
            ],
        ];

        private async logout() {
            const resData = await authService.logoutSession();
            if (resData.success) {
                this.goToLoginScreen();
            }
        }

        private goToLoginScreen() {
            this.$router.push('/auth/login');
        }

        private async mounted() {
            const resData = await authService.validateApiToken();
            if (!resData.success) {
                this.goToLoginScreen();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/scss/common/constants.scss";

    #navDrawer {
        .v-list {
            .v-list__tile {
                .v-avatar {
                    margin: 4px;
                }

                .v-list__tile__action {
                    .v-btn {
                        margin: 6px;
                    }
                }
            }

            .router-link-active {
                border-right: $accentColor solid $border-small;
                background-color: rgba(127, 127, 127, 0.15);
            }
        }
    }

    /* Transitions */

    // Nav Drawer
    .nav-drawer-enter-active,
    .nav-drawer-leave-active {
        transition: transform 0.5s 0.5s !important;
    }
    .nav-drawer-enter,
    .nav-drawer-leave-to {
        transform: translateX(-100px) !important;
    }
</style>
