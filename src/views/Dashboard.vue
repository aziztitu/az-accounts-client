<template>
    <div id="dashboard" class="d-flex" v-resize="onWindowResized">
        <NavToolbar>
            <template slot="hamburgerHolder">
                <v-btn v-if="isOnMobile" icon @click.stop="showNavDrawer = !showNavDrawer">
                    <v-icon v-if="showNavDrawer">chevron_left</v-icon>
                    <v-icon v-else>menu</v-icon>
                </v-btn>
            </template>

            <template slot="mobile"></template>
        </NavToolbar>

        <transition name="nav-drawer" appear>
            <v-hover>
                <v-navigation-drawer
                    app
                    floating
                    :temporary="isOnMobile"
                    :clipped="true"
                    :mini-variant="collapseNavDrawer && !hover && !isOnMobile"
                    v-model="showNavDrawer"
                    id="navDrawer"
                    slot-scope="{ hover }"
                    :mobile-break-point="mobileBreakPoint"
                >
                    <!-- Add this for permanent clipping (even in mobile)
                        class="mt-5"
                        style="top: 16px; margin-bottom: 32px"
                    -->
                    <v-toolbar flat class="secondary" dark height="48px">
                        <v-list class="pa-0" v-if="!isOnMobile">
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
                        <v-list class="pa-0" v-else>
                            <v-list-tile @click.stop="showNavDrawer = !showNavDrawer">
                                <v-list-tile-action>
                                    <v-btn icon>
                                        <v-icon>chevron_left</v-icon>
                                    </v-btn>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>Close Navigation Drawer</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-toolbar>

                    <v-list class="pt-2">
                        <router-link to="../myAccount" tag="v-list-tile" append>
                            <v-list-tile-avatar>
                                <img
                                    src="https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1"
                                >
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>My Account</v-list-tile-title>
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

                        <v-divider></v-divider>

                        <v-list-tile v-on:click="logout()">
                            <v-list-tile-action>
                                <v-btn icon>
                                    <v-icon>exit_to_app</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>
            </v-hover>
        </transition>

        <v-content class="dashboard-content">
            <v-container class="dashboard-container d-flex" fluid>
                <v-layout class="dashboard-layout d-flex" row justify-center>
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
    import accountService, { SpecialAccountIdentifiers } from '@/services/accountService';

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
        private mobileBreakPoint = 800;
        private isOnMobile = false;

        private collapseNavDrawer = true;
        private showNavDrawer = true;


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

        private curAccount = {};

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
            this.onWindowResized();

            await this.validateLoginStatus();
            await this.fetchDashboardData();
        }

        private async validateLoginStatus() {
            const resData = await authService.validateApiToken();
            if (!resData.success) {
                this.goToLoginScreen();
            }
        }

        private async fetchDashboardData() {
            const resData = await accountService.fetchBasicAccountInfo(SpecialAccountIdentifiers.Me);
            if (resData.success) {
                // console.log(resData.accountInfo);
                this.curAccount = resData.accountInfo;
            }
        }

        private onWindowResized() {
            this.isOnMobile = window.innerWidth < this.mobileBreakPoint;
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/scss/common/constants.scss";

    #dashboard {
        min-height: 100%;

        .dashboard-content {
            flex: 1;

            .dashboard-container {
                min-height: 100%;
            }
        }
    }

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
