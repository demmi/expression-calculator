function eval() {
    // Do not use eval!!!
    return;
}


const reNumber = /-?(\d+(\.\d*)?|\.\d+)/
const reOperand = /\d[-+*/]/
const reExpr = /\(([^()]+)\)/;

let simpleCalc = (a, b, c) => {
    switch (b) {
        case '+':
            return String(Number(a) + Number(c));
        case '-':
            return String(Number(a) - Number(c));
        case '*':
            return String(Number(a) * Number(c));
        case '/':
            if (c === '0') {
                return 'TypeError: Division by zero'
            }
            else {
                return (Math.round(a / c *1000000)/1000000);
            }
    }
}

let calc = (string) => {
    if (string === 'TypeError: Division by zero') {return 'TypeError: Division by zero'}

    let numberFirst = reNumber.exec(string)[0]
    let firstPos = string.indexOf(numberFirst)
    if (!reOperand.exec(string)) {
        return string
    }
    let mathOperand = reOperand.exec(string.slice(firstPos))[0][1]
    let mathOperandPos = string.slice(numberFirst.length).indexOf(mathOperand) + numberFirst.length
    let numberSecond = reNumber.exec(string.slice(mathOperandPos+1))[0]
    let numberSecondPos = string.slice(mathOperandPos).indexOf(numberSecond) + numberFirst.length + mathOperand.length - 1
    if (mathOperand === '*' || mathOperand === '/' || !reOperand.exec(string.slice(numberSecondPos)) || reOperand.exec(string.slice(numberSecondPos))[0][1] === '+' || reOperand.exec(string.slice(numberSecondPos))[0][1] === '-') {
        string = string.replace(numberFirst + mathOperand + numberSecond, simpleCalc(numberFirst, mathOperand, numberSecond))
        return calc(string)
    }
    else {
        let secondOperand = reOperand.exec(string.slice(numberSecondPos + numberSecond.length - 1))[0][1]
        let secondOperandPos = string.slice(numberSecondPos + numberSecond.length).indexOf(secondOperand) + numberFirst.length + mathOperand.length + numberSecond.length
        let numberThird = reNumber.exec(string.slice(secondOperandPos+1))[0]
        string = string.replace(numberSecond + secondOperand + numberThird, simpleCalc(numberSecond, secondOperand, numberThird))
        return calc(string)
    }

}

let newFunct = (expr) => {
    if (expr === 'TypeError: Division by zero') {return 'TypeError: Division by zero.'}
    else if (reExpr.test(expr)) {
        expr = expr.replace(reExpr.exec(expr)[0], calc(reExpr.exec(expr)[1]))
        return newFunct(expr)
    }

    else if (reOperand.test(expr)) {
        expr = calc(expr)
        return newFunct(expr)
    }

    else {        
        return Math.round(Number(expr)*10000)/10000
    }

}


function expressionCalculator(expr) {

    expr = expr.split(' ').join('');
    if (expr.search('/0') !== -1) {throw new Error('TypeError: Division by zero.')}

    let openBracket = 0;
    let closeBracket = 0;
    for(let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') openBracket++;
        if (expr[i] === ')') closeBracket++;
    }
    if (openBracket !== closeBracket) {throw 'ExpressionError: Brackets must be paired'}
    return newFunct(expr)
}



module.exports = {
    expressionCalculator
}

console.log(expressionCalculator(" 24 - 23 * 17 / (  93 + 52 * 70 * (  6 + 91 / (  (  4 / 39 / 8 * 30  ) / (  22 * 97 * (  32 * 20 * (  82 - 80 * 51 / 89 * 9  ) * 56 + 82  ) * 89  ) - 17 - 17  ) / 29 / 81  )  ) "))