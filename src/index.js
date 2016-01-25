// Load components
import MarkdownEditor from './components/markdown-editor'

let VueMarkdownEditor = {
	MarkdownEditor
}

// Setup
VueMarkdownEditor.install = function (Vue) {}

// auto install in browser
if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(VueMarkdownEditor)
}

// ES6
export default VueMarkdownEditor

// CommonJS
module.exports = exports.default