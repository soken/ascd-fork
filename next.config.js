module.exports = {
  target: 'serverless',
  images: {
    domains: ['images.ctfassets.net'],
  },
  generateBuildId: async () => 'ascd-pages',

  async redirects() {
    return [
      {
        source:
          '/publications/educational-leadership/:slug1/:slug2/:slug3/:slug.aspx',
        destination: '/el/articles/:slug',
        permanent: true,
      },
      {
        source: '/ascd-express/:slug1/:slug2/:slug.aspx',
        destination: '/el/articles/:slug',
        permanent: true,
      },
      {
        source: '/Publications/Books/Overview/:slug.aspx',
        destination: '/books/:slug',
        permanent: true,
      },
      {
        source: '/publications/books/:slug.aspx',
        destination: '/books',
        permanent: true,
      },
      {
        source: '/about-ascd.aspx',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-ascd/Connected-Communities.aspx',
        destination: '/communities',
        permanent: true,
      },
      {
        source: '/about-ascd/Affiliates/Affiliates.aspx',
        destination: '/affiliates',
        permanent: true,
      },
      {
        source: '/about-ascd/Affiliates/Directory/Affiliate-Directory.aspx',
        destination: '/affiliates/all',
        permanent: true,
      },
      {
        source: '/books-publications.aspx',
        destination: '/books',
        permanent: true,
      },
      {
        source: '/memberships.aspx',
        destination: '/memberships',
        permanent: true,
      },
      {
        source: '/Publications/ascd-authors/browse-all-authors.aspx',
        destination: '/people/all',
        permanent: true,
      },
      {
        source: '/Publications/ascd-authors/:slug.aspx',
        destination: '/people/:slug',
        permanent: true,
      },
      {
        source: '/publications/educational-leadership.aspx',
        destination: '/el',
        permanent: true,
      },
      {
        source: '/professional-development/webinars/:slug.aspx',
        destination: '/webinars',
        permanent: true,
      },
      {
        source: '/professional-development/pls/services.aspx',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/professional-development/videos/:slug*',
        destination: '/videos',
        permanent: true,
      },
      {
        source:
          '/publications/curriculum-handbook/421/chapters/ASCD-Resources.aspx',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/about-ascd/ASCD-Privacy-Statement.aspx',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/about-ascd/Terms-of-Use.aspx',
        destination: '/terms-of-use',
        permanent: true,
      },
      // {
      //   source: '/:slug1*/FAQ/:slug*',
      //   destination: '/faq',
      //   permanent: true,
      // },
      {
        source: '/Publications/Educational-Leadership/EL-Podcast.aspx',
        destination: '/podcasts',
        permanent: true,
      },
      //need to update nextjs version to make the following work
      // {
      //   source: '/:slug/',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'inservice.ascd.org',
      //     },
      //   ],
      //   destination: '/blogs/:slug',
      //   permanent: true,
      // },
    ]
  },
}
