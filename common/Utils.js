
const facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?u='
const twitterShareLink = 'https://twitter.com/share?url='

function mArrayRemove(arr, value) {
	return arr.filter( (el) => {
		return el !== value
	})
}

export { mArrayRemove, facebookShareLink, twitterShareLink }