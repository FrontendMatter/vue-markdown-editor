var path = require('path')
var WebpackConfig = require('themekit-webpack-config')
var config = new WebpackConfig()
	.withStandaloneEntry('vue-markdown-editor')
	.withLibrary('VueMarkdownEditor')
	.withAlias({
		'vue-markdown-editor': path.resolve(__dirname, '..')
	})
	.webpack({
		externals: [{
			'marked': 'marked'
		}]
	})
	.use('extract')

module.exports = config