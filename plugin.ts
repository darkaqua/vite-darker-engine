import {HmrContext, Plugin} from "vite";
import colors from 'picocolors'

type SystemData = {
	url: string,
	basePath: string[],
	funcName: string
}

const getSystemObject = (file: string, content: string): SystemData => {
	//@ts-ignore
	const currentDirName = __dirname.replaceAll('\\', '/') + '/'
	
	const url = file.replace(currentDirName, '')
	const parts = url.split('/');
	
	const match = /export const (.*) = \(/.exec(content)
	
	return {
		url,
		basePath: parts.slice(0, -1),
		funcName: match[1],
	};
}

export const plugin = (): Plugin => {
	let _server;
	
	return {
		name: 'vite-darker-engine',
		enforce: 'pre',
		handleHotUpdate: async (ctx: HmrContext) => {
			if(ctx.file.indexOf('.system.ts') === -1) return
			
			const systemObject = getSystemObject(ctx.file, await ctx.read())
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

export const initViteDarkerEnginePlugin = (hot, onSwapSystem: (systemModule: any, systemData: SystemData) => void) => {
	if (hot) {
		hot.on('dev:system', async (systemData: SystemData) => {
			const systemModule = await import(/* @vite-ignore */`/${systemData.url}?a=${performance.now()}`)
			onSwapSystem(systemModule, systemData)
		})
	}
}
