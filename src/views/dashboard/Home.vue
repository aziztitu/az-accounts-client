<template>
    <Placeholder></Placeholder>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import App, { AppEventType } from '@/App.vue';
    import Logo from '@/components/common/app/Logo.vue';
    import Placeholder from '@/views/misc/Placeholder.vue';

    @Component({
        components: {
            Logo,
            Placeholder,
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
            this.logoImage = require(`@/assets/images/logo/logo-outline-${(this.$refs.logoContainer as any).classes['theme--dark'] ? 'white' : 'black'}-48.png`);
        }
    }
</script>

<style lang="scss" scoped>
</style>

