Router.route('*', {
  where: 'server',
  action: function() {
    console.log('hello')
  }
})