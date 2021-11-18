module.exports = {
  // Since `gatsby-plugin-typescript` is automatically included in Gatsby you
  // don't need to define it here (just if you need to change the options)
  plugins: [
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-firebase`,
      option: {
        credentials: {
          apiKey: 'AIzaSyBBu2D-owaz14CfZvmOqjSoN0oMde5D5NE',
          authDomain: 'weight-training-8a1ac.firebaseapp.com',
          databaseURL: 'https://weight-training-8a1ac.firebaseio.com',
          projectId: 'weight-training-8a1ac',
          storageBucket: 'weight-training-8a1ac.appspot.com',
          messagingSenderId: '21223491336',
          appId: '1:21223491336:web:7378ae65a038e84eda8ebd',
          measurementId: 'G-4F9TH5XYE6',
        },
      },
    },
  ],
};
