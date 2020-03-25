import Parser from './parser'

const textarea = document.querySelector('#content')
const content = new Parser()

textarea.addEventListener('change', () => {
    const strArray = content.getStringsArray(textarea)
    console.clear()

    for (const str of strArray) {
        // console.log('NUMBERS: ' + content.parseNumbers(str))
        // console.log('OPERATORS: ' + content.parseOperators(str))
        // console.log('BRAKETS: ' + content.parseBrakets(str))
        // console.log('VARIABLE: ' + content.parseVariables(str))
        // console.log('TOKENS: ' + content.parseTokens(str))
        console.log('RESULT: ' + calc(content.parseTokens(str)))
    }
})

function calc(tokens) {
    const stackNum = []
    const stackOther = []
    const priorities = {
        '+': 1,
        '-': 1,
        '/': 2,
        '*': 2,
    }
    const regexp = {
        number: /\d+/,
        braket: /\(|\)/,
        operator: /\+|\-|\*|\//
    }

    for (const token of tokens) {
        if (regexp.number.test(token)) {
            stackNum.push(token)
        } else if (regexp.braket.test(token)) {
            if (token === '(') {
                stackOther.push(token)
            } else if (token === ')') {
                if (lookAtTop(stackOther) === '(') {
                    stackOther.pop()
                } else {
                    while (lookAtTop(stackOther) !== '(') {
                        stackNum.push( calculate( stackNum.pop(), stackNum.pop(), stackOther.pop() ) )
                    }
                    if (lookAtTop(stackOther) === '(') {
                        stackOther.pop()
                    }
                }
            }
        } else if (regexp.operator.test(token)) {
            while (lookAtTop(stackOther) !== '(' 
            && priorities[lookAtTop(stackOther)] >= priorities[token]) {
                stackNum.push( calculate( stackNum.pop(), stackNum.pop(), stackOther.pop() ) )
            }

            stackOther.push(token)
        }
    }

    console.log('NUM: ' + stackNum, 'OTHER: ' + stackOther)

    while (stackOther.length > 0
        && stackNum.length - 1 === stackOther.length) {
            stackNum.push( calculate( stackNum.pop(), stackNum.pop(), stackOther.pop() ) )
    }
    console.log('NUM: ' + stackNum, 'OTHER: ' + stackOther)

    if (stackNum.length === 1) {
        return stackNum[0]
    } else {
        return ''
    }
}

function calculate(operandB, operandA, operation) {
    switch (operation) {
        case '+':
            return Number(operandA) + Number(operandB)
        case '-':
            return Number(operandA) - Number(operandB)
        case '/':
            return Number(operandA) / Number(operandB)
        case '*':
            return Number(operandA) * Number(operandB)
    }
}

function lookAtTop(arr) {
    if (arr.length > 0) {
        return arr[arr.length - 1]
    } else {
        return null
    }
}