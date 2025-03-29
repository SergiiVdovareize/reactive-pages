module.exports = {
  ci:{
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3003']
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.85}],
        'categories:accessibility': ['error', {minScore: 0.9}]
      }
    },
    upload:{
      target: 'temporary-public-storage',
    },
  },
};