import colors from 'picocolors'

const getSystemObject = (currentDirName, file, content) => {

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
		name: 'vite-darker-engine',
		enforce: 'pre',
		handleHotUpdate: async (ctx) => {
			if(ctx.file.indexOf('.system.ts') === -1) return

			const currentDirName = ctx.server.config.envDir.replaceAll('\\', '/') + '/'
			const systemObject = getSystemObject(currentDirName, ctx.file, await ctx.read())
			_server.config.logger.info(colors.yellow(`system hot-reload `) + colors.dim(systemObject.funcName), {
				clear: true,
				timestamp: true,
			})
			_server.ws.send('dev:system', systemObject)
			return []
		},
		configureServer(server) {
			_server = server
		},
	}
}

export const initViteDarkerEnginePlugin = (hot, onSwapSystem) => {
	if (hot) {
		hot.on('dev:system', async (systemData) => {
			const systemModule = await import(/* @vite-ignore */`/${systemData.url}?a=${Math.trunc(performance.now())}`)
			onSwapSystem(systemModule, systemData)
		})
	}
}
