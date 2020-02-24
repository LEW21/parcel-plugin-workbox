const { generateSW } = require('workbox-build')
const fs = require('fs')
const logger = require('@parcel/logger')
const path = require('path')

const swTag = `<script>if ('serviceWorker' in navigator) window.addEventListener('load', function() {navigator.serviceWorker.register('/sw.js')})</script>`

module.exports = bundler => {
	bundler.on('bundled', async (bundle) => {
		const manifestEntries = []

		const handleBundle = (bundle) => {
			const isMap = bundle.name.endsWith('.map')
			if (!isMap) {
				manifestEntries.push({
					url: path.basename(bundle.name),
					revision: bundle.getHash(),
				})
			}

			bundle.childBundles.forEach(handleBundle)
		}
		handleBundle(bundle)

		const {count} = await generateSW({
			additionalManifestEntries: manifestEntries,
			swDest: path.resolve(bundler.options.outDir, 'sw.js'),
			ignoreURLParametersMatching: [/.*/],
		})
		logger.success(`Generated sw.js, which will precache ${count} files.`)

		const index = path.resolve(bundler.options.outDir, 'index.html')
		fs.readFile(index, 'utf8', (err, data) => {
			if (err) logger.error(err)
			if (!data.includes('serviceWorker.register')) {
				data = data.replace('</body>', swTag + '</body>')
				fs.writeFileSync(index, data)
				logger.success(`Service worker injected into index.html.`)
			}
		})
	})
}
