// Load components
import MarkdownEditor from './components/markdown-editor'

let VueMarkdownEditor = {
	MarkdownEditor
}

// Load directives
// import MyDirective from './directives/my-directive'

// Setup
VueMarkdownEditor.install = function (Vue) {
	// Register directives
	// Vue.directive('my-directive', MyDirective)
}

// auto install in browser
if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(VueMarkdownEditor)
}

// ES6
export default VueMarkdownEditor

// CommonJS
module.exports = exports.default