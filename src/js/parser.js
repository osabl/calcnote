export default class Parser {
    constructor() {
        this.number = '(?<=(^|\\+|\\-|\\*|\\/|\\^|\\()\\s*|\\s+)\\-*\\d+\\.*\\d*'
        this.operator = '(?<!^)(\\+|\\-|\\*|\\/|\\^)(?<!$)'
        this.braket = '\\(|\\)'
        this.tokens = new RegExp(`${this.number}|${this.operator}|${this.braket}`, 'g')
        this.variables = new RegExp('(?<=\W\$)\d+', 'g')
    }

    parse(fullString) {
        const result = []
        const strArray = fullString.split(/\n/)
        console.log(strArray)

        for (const str of strArray) {
            if (str.length === 0) {
                result.push('')
            } else {
                str.replace(this.variables, (match) => {
                    if (result.length >= match) {
                        return result[match - 1]
                    } else {
                        return ''
                    }
                })

                const tokens = str.match(this.tokens)
                result.push(this.calc(tokens))
            }
        }

        return result
    }

    calculate(operandB, operandA, operation) {
        switch (operation) {
            case '+':
                return Number(operandA) + Number(operandB)
            case '-':
                return Number(operandA) - Number(operandB)
            case '/':
                return Number(operandA) / Number(operandB)
            case '*':
                return Number(operandA) * Number(operandB)
            case '^':
                return Math.pow(Number(operandA), Number(operandB))
        }
    }

    calc(tokens) {
        if (tokens === null) {
            return ''
        }
        
        const stackNum = []
        const stackOther = []
        const priorities = {
            '+': 1,
            '-': 1,
            '/': 2,
            '*': 2,
            '^': 3
        }
        const regexp = {
            number: /\d+\.*\d*/,
            braket: /\(|\)/,
            operator: /\+|\-|\*|\/|\^/
        }

        for (const token of tokens) {
            if (regexp.number.test(token)) {
                stackNum.push(token)
            } else if (regexp.braket.test(token)) {
                if (token === '(') {
                    stackOther.push(token)
                } else if (token === ')') {
                    if (stackOther[stackOther.length - 1] === '(') {
                        stackOther.pop()
                    } else {
                        while (stackOther[stackOther.length - 1] !== '(' && stackOther.length > 0) {
                            stackNum.push(this.calculate(stackNum.pop(), stackNum.pop(), stackOther.pop()))
                        }
                        if (stackOther[stackOther.length - 1] === '(') {
                            stackOther.pop()
                        }
                    }
                }
            } else if (regexp.operator.test(token)) {
                while (stackOther[stackOther.length - 1] !== '(' &&
                    priorities[stackOther[stackOther.length - 1]] >= priorities[token]) {
                    stackNum.push(this.calculate(stackNum.pop(), stackNum.pop(), stackOther.pop()))
                }

                stackOther.push(token)
            }
        }

        while (stackOther.length > 0 &&
            stackNum.length - 1 === stackOther.length) {
            stackNum.push(this.calculate(stackNum.pop(), stackNum.pop(), stackOther.pop()))
        }

        if (stackNum.length === 1 && !isNaN(stackNum[0])) {
            return stackNum[0]
        } else {
            return ''
        }
    }
}