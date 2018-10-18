export default value => {
    // console.log(value, typeof value)
    if ( value === undefined ) {
        return true
    }

    const valueNumber = Number(value)

    if (isNaN(valueNumber) || valueNumber < 0 ) {
      return false
    }

    return true
}
