module.exports = {
  content: [ 'nagency/src/**/*.html' ],
  theme: {
    screens: {
      'sm': '426px',
      'md': '769px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      fontSize: {
        'h1': [ '3.75rem', '1.2' ],
        'h2': [ '3rem', '1.375' ],
        'h3': [ '2rem', '1.625' ],
        'h4': [ '1.5rem', '1.460' ],
      },
    },
  },
};
