import Parser from './parser'

const input = document.querySelector('#content')
const output = document.querySelector('#result')
const parser = new Parser()

input.addEventListener('input', () => {
    output.value = ''
    const result = parser.parse(input.value)

    for (const value of result) {
        output.value += value + '\n'
    }
})