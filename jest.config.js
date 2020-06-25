module.exports = {
  transform: {
    '^.+\\.svelte$': 'jest-transform-svelte',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
