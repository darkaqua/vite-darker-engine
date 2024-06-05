import {HmrContext, Plugin} from "vite";
import colors from 'picocolors'

const getSystemObject = (file: string, content: string) => {
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
			if(ctx.file.indexOf('system.ts') === -1) return
			
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
			// server.ws.on('connection', () => {
			// 	console.log('asdasd')
			// 	server.ws.send('my:greetings', { msg: 'hello' })
			// })
		},
	}
}

export const abc = (hot, onSwapSystem: (abc, data) => void) => {
	if (hot) {
		hot.on('dev:system', async (data) => {
			const abc = await import(/* @vite-ignore */`/${data.url}?a=${performance.now()}`)
			// abc[data.funcName]().onLoad()
			onSwapSystem(abc, data)
		})
	}
}
