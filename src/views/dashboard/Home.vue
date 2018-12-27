<template>
    <div class="home">
        <v-card class="flat transparent logo-container d-flex justify-center" ref="logoContainer">
            <v-img alt="Vue logo" :src="logoImage" max-width="300px"></v-img>
        </v-card>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import App, { AppEventType } from '@/App.vue';

    @Component({
        components: {
        },
    })
    export default class Home extends Vue {
        private logoImage = '';

        private created() {
            App.instance.appEventEmitter.on(this.appEventListener);
        }

        private mounted() {
            this.updateImage();
        }

        private destroyed() {
            App.instance.appEventEmitter.off(this.appEventListener);
        }

        private appEventListener(event: AppEventType) {
            if (event === AppEventType.ThemeChanged) {
                this.updateImage();
            }
        }

        private updateImage() {
            this.logoImage = require(`@/assets/images/logo/hi-res/glass-${(this.$refs.logoContainer as any).classes['theme--dark'] ? 'white' : 'black'}.png`);
        }
    }
</script>

<style lang="scss" scoped>
</style>

