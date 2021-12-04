module.exports = {
  // Since `gatsby-plugin-typescript` is automatically included in Gatsby you
  // don't need to define it here (just if you need to change the options)
  plugins: [
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-use-query-params`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-4F9TH5XYE6'],
      },
    },
  ],
};
