module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        gatsbyRemarkPlugins: ['gatsby-remark-mermaid'],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-offline',
  ],
};
