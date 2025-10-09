String.prototype.snakeToCamel = function () {
    if (!this.includes('_')) return this.toString()

    return this.replace(/(_[a-z])/g, (match) => match.charAt(1).toUpperCase())
}
String.prototype.capitalize = function () {
    if (this.length === 0) return this.toString()
    return this.charAt(0).toUpperCase() + this.slice(1)
}
