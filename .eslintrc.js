module.exports = {
    root: true,

    env: {
        node: true,
        // The Follow config only works with eslint-plugin-vue v8.0.0+
        "vue/setup-compiler-macros": true,
    },

    extends: [
        'plugin:vue/vue3-essential',
        '@vue/airbnb',
        '@vue/typescript/recommended',
    ],

    parserOptions: {
        ecmaVersion: 2020,
    },

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
    // The Follow configs works with eslint-plugin-vue v7.x.x
    globals: {
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
    },
};
