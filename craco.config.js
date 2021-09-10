const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {... getThemeVariables({
                           dark: true, // Enable dark mode
                           compact: false, // Enable compact mode
                          
                         }),
                        //  '@primary-color': '#1DA57A'
                         },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};