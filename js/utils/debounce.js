const debounceHandler = ($input, callback, delay) => {
    let debounceTimeout = null
    return () => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            callback($input.value)
        }, delay)
    }
}

export default debounceHandler