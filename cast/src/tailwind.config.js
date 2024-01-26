module.exports = {
  content: [ 'cast/src/**/*.html' ],
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
        'h1': [ '1.625rem', '1.2' ],
        'h2': [ '1.313rem', '1.2' ],
      },
    },
  },
};
