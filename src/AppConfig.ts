import colors from 'vuetify/es5/util/colors';

export default {
    title: 'AZ Accounts',
    api: {
        baseURL: `http://192.168.0.15:8081`,
    },
};

export const defaultTheme = {
    primary: colors.cyan.darken3,
    secondary: colors.cyan.darken4,
    accent: colors.orange.accent3,
};
