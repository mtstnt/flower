import { Nullable } from "vitest";
import { ExprToken, Token } from "./expr_tokenizer";

export enum ASTNodeType {
    LiteralNumber,
    LiteralString,
    LiteralBoolean,

    Identifier,

    NumberNegation,
    Not,

    ExpressionPlus,
    ExpressionMinus,
    ExpressionMultiply,
    ExpressionDivide,
    ExpressionModulo,

    ExpressionAnd,
    ExpressionOr,
    ExpressionEquals,
    ExpressionNotEqual,
    ExpressionLessThan,
    ExpressionLessThanOrEqual,
    ExpressionGreaterThan,
    ExpressionGreaterThanOrEqual,
}

// Errors
abstract class ProgramError extends Error {
    constructor(
        public message: string,
    ) { super(message) }
}

type StateObj = Map<string, string | number | boolean>;

class UnknownVariableError extends ProgramError {}
class InvalidNumberError extends ProgramError {}

abstract class ExprNode {
    abstract traverse(state: StateObj): any;
}

export abstract class BinaryExprNode extends ExprNode {
    constructor(
        public left: ExprNode,
        public right: ExprNode,
    ) { super() }
}

export class ExprLiteralNumber extends ExprNode {
    constructor(public value: string) { super() }
    traverse(_: StateObj): number {
        const value = parseInt(this.value);
        if (Number.isNaN(value)) {
            throw new InvalidNumberError(`Invalid value of ${value}`);
        }
        return value;
    }
}

export class ExprIdentifier extends ExprNode {
    constructor(public value: string) { super() }
    traverse(state: StateObj) {
        if (state.has(this.value)) {
            return state.get(this.value);
        }
        throw new UnknownVariableError(`Variable '${this.value}' is not declared or out of scope.`);
    }
}

export class ExprNodeAnd extends BinaryExprNode {
    traverse(state: StateObj): any {
        return (this.left?.traverse(state) ?? false) && (this.right?.traverse(state) ?? false);
    }
}

export class ExprNodeOr extends BinaryExprNode {
    traverse(state: StateObj): any {
        return (this.left?.traverse(state) ?? false) || (this.right?.traverse(state) ?? false);
    }
}

export class ExprNodeComparison extends BinaryExprNode {
    constructor(
        public kind: string,
        public left: ExprNode,
        public right: ExprNode,
    ) { super(left, right) }

    traverse(state: StateObj): any {
        const left = this.left.traverse(state)
        if (typeof left != 'number') {
            throw new InvalidNumberError(`The result of left evaluation ${left} is not a number`);
        }
        const right = this.right.traverse(state)
        if (typeof right != 'number') {
            throw new InvalidNumberError(`The result of right evaluation ${right} is not a number`);
        }
        switch (this.kind) {
            case "<": return left < right;
            case "<=": return left <= right;
            case ">": return left > right;
            case ">=": return left >= right;
            case "==": return left == right;
            case "!=": return left != right;
        }
        throw new Error("what opeator is this: " + this.kind);
    }
}


export class ExprNodeMathOperator extends BinaryExprNode {
    constructor(
        public kind: string,
        public left: ExprNode,
        public right: ExprNode,
    ) { super(left, right) }

    traverse(state: StateObj): any {
        const left = this.left.traverse(state)
        if (typeof left != 'number') {
            throw new InvalidNumberError(`The result of left evaluation ${left} is not a number`);
        }
        const right = this.right.traverse(state)
        if (typeof right != 'number') {
            throw new InvalidNumberError(`The result of right evaluation ${right} is not a number`);
        }
        switch (this.kind) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
        }
        throw new InvalidNumberError("invalid operator " + this.kind);
    }
}

export class ExprLiteralString extends ExprNode {
    constructor(public value: string) { super() }
    traverse(_: any) {
        return this.value;
    }
}

/**
 * Precedence table stores the order of which the AST tree node must be prioritised over another.
 * This is taken from C's standard, only picking some relevant ones.
 */
const precedenceTable = new Map<ExprToken, number>([
    [ExprToken.Asterisk, 1],
    [ExprToken.Slash, 1],
    [ExprToken.Modulo, 1],
    [ExprToken.Plus, 2],
    [ExprToken.Minus, 2],
    [ExprToken.LessThan, 3],
    [ExprToken.LessThanOrEqual, 3],
    [ExprToken.GreaterThan, 3],
    [ExprToken.GreaterThanOrEqual, 3],
    [ExprToken.Equal, 4],
    [ExprToken.NotEqual, 4],
    [ExprToken.And, 5],
    [ExprToken.Or, 6],
]);

class Parser {
    private tokenPtr: number;

    constructor(private tokens: Token[]) {
        this.tokenPtr = 0;
    }

    //
    // ATOM = NUMBER | STRING | IDENTIFIER | ( EXPRESSION )
    public start(): Nullable<ExprNode> {
        return this.parseExpr();
    }

    /**
     * Get precedence if its an operator, else return -1
     */
    private getOperatorPrecedence(token: Token): number {
        if (!precedenceTable.has(token.tokenType)) return -1;
        return precedenceTable.get(token.tokenType)!;
    }

    private parseExpr(currentPrec: number = 99) {
        let expr: ExprNode = this.parseAtom();
        while (!this.isEOF()) {
            const op = this.current();
            const precedence = this.getOperatorPrecedence(op);
            if (precedence >= currentPrec) break;
            this.advance();
            const expr2 = this.parseExpr(precedence + 1);
            expr = this.operatorExprFactory(op, expr, expr2);
        }
        return expr;
    }

    private operatorExprFactory(operator: Token, left: ExprNode, right: ExprNode): ExprNode {
        switch (operator.tokenType) {
            case ExprToken.And: return new ExprNodeAnd(left, right);
            case ExprToken.Or: return new ExprNodeOr(left, right);

            case ExprToken.LessThan: return new ExprNodeComparison("<", left, right);
            case ExprToken.LessThanOrEqual: return new ExprNodeComparison("<=", left, right);
            case ExprToken.GreaterThan: return new ExprNodeComparison(">", left, right);
            case ExprToken.GreaterThanOrEqual: return new ExprNodeComparison(">=", left, right);
            case ExprToken.Equal: return new ExprNodeComparison("==", left, right);
            case ExprToken.NotEqual: return new ExprNodeComparison("!=", left, right);

            case ExprToken.Plus: return new ExprNodeMathOperator("+", left, right);
            case ExprToken.Minus: return new ExprNodeMathOperator("-", left, right);
            case ExprToken.Asterisk: return new ExprNodeMathOperator("*", left, right);
            case ExprToken.Slash: return new ExprNodeMathOperator("/", left, right);
        }
        throw new Error("UNDEFINED OPERATOR " + operator.repr);
    }

    private parseAtom(): ExprNode {
        const { tokenType, repr } = this.current();
        this.advance();
        switch (tokenType) {
            case ExprToken.LiteralNumber: return new ExprLiteralNumber(repr);
            case ExprToken.LiteralString: return new ExprLiteralString(repr);
            case ExprToken.Identifier: return new ExprIdentifier(repr);
            case ExprToken.LeftParenthesis:
                this.advance();
                return this.parseExpr(0);
            default: throw new Error("INVALID TERM (NOT A LITERAL OR IDENT): " + tokenType + " " + repr);
        }
    }

    private current(): Token {
        return this.tokens[this.tokenPtr];
    }

    private isEOF(): boolean { return this.tokenPtr >= this.tokens.length }

    private advance(): boolean {
        if (this.tokenPtr < this.tokens.length) {
            this.tokenPtr += 1;
            return true;
        }
        return false;
    }

    // private peek(): Token {
    //     return this.tokens[this.tokenPtr + 1];
    // }
}

export const parse = (tokens: Token[]) => {
    const parser = new Parser(tokens);
    const ast = parser.start();
    console.log(ast);
    return ast;
}
