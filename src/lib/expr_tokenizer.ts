import { Nullable } from "../nodes/common";

export enum ExprToken {
    LiteralString,
    LiteralNumber,
    Identifier,

    Plus,
    Minus,
    Asterisk,
    Slash,
    Modulo,

    LeftParenthesis,
    RightParenthesis,

    Or,
    And,
    LessThan,
    GreaterThan,

    NotEqual,
    Equal,

    LessThanOrEqual,
    GreaterThanOrEqual,

    DoubleQuote,
    SingleQuote,
}

export class Token {
    constructor(
        public tokenType: ExprToken,
        public repr: string,
    ) { }
}

export function tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let token = 0;

    function peek(): Nullable<string> {
        if (token + 1 >= expression.length) return null;
        return expression[token + 1];
    }

    while (token < expression.length) {
        const currentToken = expression[token];
        switch (currentToken) {
            case "+":
                tokens.push(new Token(ExprToken.Plus, "+"));
                token += 1;
                break;
            case "-":
                tokens.push(new Token(ExprToken.Minus, "-"));
                token += 1;
                break;
            case "*":
                tokens.push(new Token(ExprToken.Asterisk, "*"));
                token += 1;
                break;
            case "/":
                tokens.push(new Token(ExprToken.Slash, "/"));
                token += 1;
                break;
            case "%":
                tokens.push(new Token(ExprToken.Modulo, "%"));
                token += 1;
                break;
            case "(":
                tokens.push(new Token(ExprToken.LeftParenthesis, "("));
                token += 1;
                break;
            case ")":
                tokens.push(new Token(ExprToken.RightParenthesis, ")"));
                token += 1;
                break;

            case "<":
                if (peek() == "=") {
                    tokens.push(new Token(ExprToken.LessThanOrEqual, "<="));
                    token += 2;
                    break;
                }
                tokens.push(new Token(ExprToken.LessThan, "<"));
                token += 1;
                break;
            case ">":
                if (peek() == "=") {
                    tokens.push(new Token(ExprToken.GreaterThanOrEqual, ">="));
                    token += 2;
                    break;
                }
                tokens.push(new Token(ExprToken.GreaterThan, ">"));
                token += 1;
                break;

            case "&":
                if (peek() == "&") {
                    tokens.push(new Token(ExprToken.And, "&&"));
                    token += 2;
                }
                break;
            case "|":
                if (peek() == "|") {
                    tokens.push(new Token(ExprToken.Or, "||"));
                    token += 2;
                }
                break;

            case " ": while (expression[token] == " ") token += 1; break;
            default:
                if (isAlpha(expression[token])) {
                    let buf = "";
                    while (isAlphaNumeric(expression[token])) {
                        buf += expression[token];
                        token += 1;
                    }
                    tokens.push(new Token(ExprToken.Identifier, buf));
                }

                if (isNumeric(expression[token])) {
                    let buf = "";
                    while (isNumeric(expression[token])) {
                        buf += expression[token];
                        token += 1;
                    }
                    tokens.push(new Token(ExprToken.LiteralNumber, buf));
                }

                if (expression[token] == "'") {
                    let buf = "";
                    while (expression[token] != "'") {
                        buf += expression[token];
                        token += 1;
                    }
                    token += 1;
                    tokens.push(new Token(ExprToken.LiteralString, buf));
                }
        }
    }
    return tokens;
}

function isAlpha(currentToken: string) {
    return (currentToken >= 'a' && currentToken <= 'z' ||
        currentToken >= 'A' && currentToken <= 'Z');
}

function isNumeric(currentToken: string): boolean {
    return (currentToken >= '0' && currentToken <= '9');
}

function isAlphaNumeric(currentToken: string): boolean {
    return (isAlpha(currentToken) || isNumeric(currentToken));
}
