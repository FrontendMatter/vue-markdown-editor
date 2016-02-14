<template>

	<!-- Editor -->
	<div class="md-editor row" :class="editorClass">
		<div class="col-md-6 md-editor-wrapper">
			<validator name="validation">
				<textarea
					v-el:textarea
					class="form-control" 
					v-model="model"
					debounce="300"
					placeholder="Write some content ..."
					:autofocus="isFullscreen"
					field="content"
					v-validate="validate"
					@valid="updateValidator" @invalid="updateValidator">
				</textarea>
			</validator>
		</div>
		<div class="col-md-6 md-preview-wrapper">

			<!-- Close fullscreen button -->
			<button v-if="fullscreen" @click.stop="fullscreen=false" type="button" class="md-editor-floating-button"><i class="fa fa-close"></i></button>
			
			<!-- Open fullscreen button -->
			<button v-else @click.stop="fullscreen=true" type="button" class="md-editor-floating-button"><i class="fa fa-arrows-alt"></i></button>

			<!-- Markdown Preview -->
			<div :class="{ scrollable: isFullscreen }" v-el:preview>
				<div class="md-preview" v-if="model" v-html="model | marked"></div>
			</div>
		</div>
	</div>
	<!-- // END Editor -->

	<!-- Fullscreen Editor -->
	<markdown-editor 
		v-if="fullscreen && !isFullscreen" 
		v-transfer-dom 
		:model.sync="model"
		:fullscreen.sync="fullscreen"
		:validator.sync="validator"
		:validate.sync="validate">
	</markdown-editor>

</template>

<script>
	import marked from 'marked'

	export default {
		name: 'markdown-editor',
		filters: {
			marked: marked
		},
		props: {
			model: {},
			fullscreen: {
				type: Boolean
			},
			validator: {},
			validate: {
				type: Object,
				default () {
					return {
						required: {
							rule: true,
							message: 'The page content is required'
						}
					}
				}
			},
			markedOptions: {}
		},
		data () {
			return {
				scrollInitiator: null
			}
		},
		computed: {
			editorClass () {
				return {
					'md-editor-fullscreen': this.isFullscreen
				}
			},
			isFullscreen () {
				return this.$parent.$options.name === 'markdown-editor' && this.fullscreen
			},
			initiatorEvents () {
				return ['mouseenter', 'touchstart']
			}
		},
		methods: {
			initiators () {
				return [this.preview(), this.textarea()]
			},
			textarea () {
				return $(this.$els.textarea).get(0)
			},
			preview () {
				return $(this.$els.preview).get(0)
			},
			setScrollInitiator (e) {
				this.scrollInitiator = e.target
			},
			calcScrollFactor (element1, element2) {
				return (element1.scrollHeight - element1.clientHeight) / (element2.scrollHeight - element2.clientHeight)
			},
			textareaScrollFactor () {
				return this.calcScrollFactor(this.textarea(), this.preview())
			},
			previewScrollFactor () {
				return this.calcScrollFactor(this.preview(), this.textarea())
			},
			scrollFactorMax () {
				return Math.max.apply(null, [this.textareaScrollFactor(), this.previewScrollFactor()])
			},
			scrollFactorMin () {
				return Math.min.apply(null, [this.textareaScrollFactor(), this.previewScrollFactor()])
			},
			scrollTopFactor (scrollTop, scrollFactor) {
				if (!Number.isFinite(scrollFactor)) {
					return scrollTop
				}
				return Math.round(scrollTop * scrollFactor)
			},
			syncScrollTextarea (e) {
				if (this.scrollInitiator === this.preview()) {
					let scrollTop = e.target.scrollTop
					let isLargest = this.textareaScrollFactor() > 1
					let scrollFactor = isLargest ? this.scrollFactorMax() : this.scrollFactorMin()
					this.textarea().scrollTop = this.scrollTopFactor(scrollTop, scrollFactor)
				}
			},
			syncScrollPreview (e) {
				if (this.scrollInitiator === this.textarea()) {
					let scrollTop = e.target.scrollTop
					let isLargest = this.previewScrollFactor() > 1
					let scrollFactor = isLargest ? this.scrollFactorMax() : this.scrollFactorMin()
					this.preview().scrollTop = this.scrollTopFactor(scrollTop, scrollFactor)
				}
			},
			updateValidator () {
				this.validator = this.$validation
			}
		},
		created () {
			if (this.markedOptions) {
				marked.setOptions(this.markedOptions)
			}
		},
		ready () {
			if (this.isFullscreen) {
				this.initiators().forEach((initiator) => {
					this.initiatorEvents.forEach((eventName) => {
						initiator.addEventListener(eventName, this.setScrollInitiator)
					})
				})
				$(this.textarea()).on('scroll', this.syncScrollPreview)
				$(this.preview()).on('scroll', this.syncScrollTextarea)
			}
		},
		destroyed () {
			if (this.isFullscreen) {
				this.initiators().forEach((initiator) => {
					this.initiatorEvents.forEach((eventName) => {
						initiator.removeEventListener(eventName, this.setScrollInitiator)
					})
				})
				$(this.textarea()).off('scroll', this.syncScrollPreview)
				$(this.preview()).off('scroll', this.syncScrollTextarea)
			}
		}
	}
</script>

<style lang="sass">
	.md-editor {
		margin: 0;
		background-color: #f9f9f9;
		border: 1px solid $panel-default-border;
		border-radius: $border-radius-base;
		position: relative;
		> [class*="col-"] {
			padding: 0;
		}
		.md-editor-wrapper {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
		}
		.md-preview-wrapper {
			padding: 0;
			display: inline-block;
			float: right;
			min-height: 100px;
			height: 100%;
		}
		.md-preview-wrapper, .md-preview, textarea {
			vertical-align: top;
		}
		.md-preview, textarea {
			padding: 20px;
		}
		textarea {
			height: 100%;
			border: none;
			border-right: 1px solid $panel-default-border;
			border-radius: $border-radius-base 0 0 $border-radius-base;
			box-shadow: none;
			resize: none;
			outline: none;
			line-height: inherit;
			font-size: inherit;
			letter-spacing: inherit;
			&:focus {
				outline: none;
				box-shadow: none;
				border-color: $panel-default-border;
			}
		}
		.md-editor-floating-button {
			padding: 0;
			cursor: pointer;
			background: transparent;
			border: 0;
			-webkit-appearance: none;
			float: right;
			font-weight: bold;
			color: #000;
			text-shadow: 0 1px 0 #fff;
			font-size: 18px;
			right: 5px;
			top: 5px;
			position: absolute;
			z-index: 1;
			line-height: 20px;
		}
		&.md-editor-fullscreen {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 10000;
			.md-preview-wrapper .simplebar {
				padding-top: 20px;
			}
		}
	}
	.scrollable {
		-webkit-overflow-scrolling: touch;
		overflow-y: scroll;
		overflow-x: auto;
		height: 100%;
		position: relative;
	}
</style>