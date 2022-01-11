
function mArrayRemove(arr, value) {
	return arr.filter( (el) => {
		return el !== value
	})
}

export { mArrayRemove }