import colors from 'picocolors'

const getComponentObject = (currentDirName, file, content) => {

	const url = file.replace(currentDirName, '')
	const parts = url.split('/');

	const match = /export const (.*): /.exec(content)

	return {
		url,
		basePath: parts.slice(0, -1),
		funcName: match[1],
	};
}

export const plugin = ()  => {
	let _server;

	return {
		name: 'vite-tulip',
		enforce: 'pre',
		handleHotUpdate: async (ctx) => {
			if(ctx.file.indexOf('.component.ts') === -1) return

			const currentDirName = ctx.server.config.envDir.replaceAll('\\', '/') + '/'
			const componentObject = getComponentObject(currentDirName, ctx.file, await ctx.read())
			_server.config.logger.info(colors.yellow(`component hot-reload `) + colors.dim(componentObject.funcName), {
				clear: true,
				timestamp: true,
			})
			_server.ws.send('dev:component', componentObject)
			return []
		},
		configureServer(server) {
			_server = server
		},
	}
}

export const initViteTulipPlugin = (hot, onSwapComponent) => {
	if (hot) {
		hot.on('dev:component', async (componentData) => {
			const componentModule = await import(/* @vite-ignore */`/${componentData.url}?a=${Math.trunc(performance.now())}`)
			onSwapComponent(componentModule, componentData)
		})
	}
}