module.exports = {
  pathPrefix: '/gatsby-docz-mermaid',
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
