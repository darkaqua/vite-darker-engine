import {utilsTest} from "../../utils";

export const something123System = () => {
	
	const onLoad = () => {
		console.log('load', utilsTest())
	}
	
	const onDestroy = () => {
		console.log('destroy', utilsTest())
	}
	
	return {
		onLoad,
		onDestroy
	}
}