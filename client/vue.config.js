module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder

        appId: 'PXL-Socket-Programming',
        mac: {
          target: 'pkg',
        },

      },
    },
  },
};
