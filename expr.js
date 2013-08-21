var esprima = require('esprima'),
    jsAST;

function extractExpressionFrom (code) {
    var esprimaOptions = {
        tolerant: true
        // , loc: true
        // , range: true
    };
    var tree = esprima.parse(code, esprimaOptions),
        expressionStatement = tree.body[0];
    return expressionStatement.expression;
}

jsAST = extractExpressionFrom(process.argv[2]);
console.log(JSON.stringify(jsAST, null, 4));
