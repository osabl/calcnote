export default class Parser {

    getStringsArray(textarea) {
        return textarea.value.split(/\n/)
    }

    parseTokens(string) {
        return string.match(/(?<=(^|\s|\+|\-|\*|\/|\())\d+|(?<!^)(\+|\-|\*|\/)(?<!$)|\(|\)/g)
    }

    parseNumbers(string) {
        return string.match(/(?<=(^|\s|\+|\-|\*|\/|\())\d+/g)
    }

    parseOperators(string) {
        return string.match(/(?<!^)(\+|\-|\*|\/)(?<!$)/g)
    }

    parseBrakets(string) {
        return string.match(/\(|\)/g)
    }

    parseVariables(string) {
        return string.match(/(?<=(^\$|\s\$|\(\$))\d+/g)
    }
}