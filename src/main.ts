import {something123System} from "./something/hallo/something-123.system";
import {abc} from "../plugin";


// const abc = () => {
// 	if (import.meta.hot) {
// 		import.meta.hot.on('dev:system', async (data) => {
// 			const abc = await import(/* @vite-ignore */`/${data.url}?a=${performance.now()}`)
// 			abc[data.funcName]().onLoad()
// 		})
// 	}
// }

//@ts-ignore
abc(import.meta.hot, (a, b) => {
	console.log(a, b)
})

something123System().onLoad()