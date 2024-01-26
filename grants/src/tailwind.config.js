module.exports = {
  content: [ 'grants/src/**/*.html' ],
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
        'h1': [ '4.8rem', '1.15' ],
        'h2': [ '3.6rem', '1.15' ],
        'h3': [ '2.4rem', '1.2' ],
        'h4': [ '1.9rem', '1.2' ],
        'h5': [ '1.45rem', '1.4' ],
      },
    },
  },
};
