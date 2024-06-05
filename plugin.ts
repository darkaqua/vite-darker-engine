import {HmrContext, ModuleNode, Plugin} from "vite";

export const plugin = (): Plugin => {

	let _server;
	
	return {
		name: 'vite-darker-engine',
		enforce: 'pre',
		handleHotUpdate: async (ctx: HmrContext) => {
			if(ctx.file.indexOf('system.ts') === -1) return
			console.log(await ctx.read(), ctx.file, '<')
			_server.ws.send('my:greetings', { msg: 'hello' })
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