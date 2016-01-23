# vue-markdown-editor

A Vue.js markdown editor component.

## Usage

#### Install

```bash
npm install vue-markdown-editor
```

#### Dependencies

```js
// Vue library
import Vue from 'vue'

// vue-validator
import VueValidator from 'vue-validator'
Vue.use(VueValidator)

// vue-transfer-dom
import VueTransferDom from 'vue-transfer-dom'
Vue.use(VueTransferDom)
```

#### vue-markdown-editor

##### JavaScript (ES6):

```js
import { MarkdownEditor } from 'vue-markdown-editor'
new Vue({
	el: '#app',
	data () {
		return {
			content: null,
			validator: null,
			markedOptions: {
				highlight: function (code) {
					return require('highlight.js').highlightAuto(code).value
				}
			}
		}
	},
	methods: {
		submit () {
			if (this.validator.valid) {
				// do stuff
			}
		}
	},
	components: {
		MarkdownEditor
	}
})
```

##### Template:

```html
<div id="app">
	<form @submit.prevent="submit">
		<div class="form-group" :class="{ 'has-error': validator && validator.content.invalid }">
			<label for="content">Content</label>
			
			<markdown-editor
				:model.sync="content"
				:validator.sync="validator"
				:marked-options="markedOptions">
			</markdown-editor>
			
			<p class="help-block" 
				v-if="validator" 
				v-for="msg in validator.content.messages">
				{{ msg }}
			</p>
			
		</div>
		<div class="form-group">
			<button type="submit" class="btn btn-success">Save</button>
		</div>
	</form>
</div>
```

## Build

> You can easily build vue-markdown-editor yourself.

### Prerequisites

Our build tool of choice is Webpack. You should have webpack installed globally:

	npm install -g webpack

And the build dependencies:

	npm install
	
### Build

> Any of the following will create the files dist/vue-markdown-editor.js and dist/vue-markdown-editor.css.

#### Production build

Includes minification and several optimizations:

	npm run build

#### Development build

A faster build suited for development, with no optimizations and without minification:

	npm run build-dev
	
### Watch

Start an initial development build and then FAST continuous incremental builds:

	npm run dev