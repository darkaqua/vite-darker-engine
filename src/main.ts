import {somethingSystem} from "./something.system";


console.log(import.meta.hot)
if (import.meta.hot) {
	import.meta.hot.on('my:greetings', (data) => {
		console.log(data.msg) // hello
	})
}


console.log( new Error().stack)