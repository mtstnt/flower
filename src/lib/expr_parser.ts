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

abstract class ExprNode {
    abstract traverse(state: any): any;
}

export abstract class BinaryExprNode extends ExprNode {
    constructor(
        public left: ExprNode,
        public right: ExprNode,
    ) { super() }
}

export class ExprLiteralNumber extends ExprNode {
    constructor(public value: number) { super() }
    traverse(state: any): any {
        return this.value!;
    }
}

export class ExprIdentifier extends ExprNode {
    constructor(public value: string) { super() }
    traverse(state: any) {
        return state[this.value];
    }
}

export class ExprNodeAnd extends BinaryExprNode {
    constructor(
        public left: ExprNode,
        public right: ExprNode,
    ) { super(left, right) }

    traverse(state: any): any {
        return this.left?.traverse(state)! && this.right?.traverse(state)!;
    }
}

export class ExprNodeOr extends BinaryExprNode {
    constructor(
        public left: ExprNode,
        public right: ExprNode,
    ) { super(left, right) }

    traverse(state: any): any {
        return this.left?.traverse(state)! || this.right?.traverse(state)!;
    }
}

export class ExprLiteralString extends ExprNode {
    constructor(public value: string) { super() }
    traverse(state: any) {
        return this.value;
    }
}

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
     * @param {Token} token
     * @returns {number}
     */
    private getOperatorPrecedence(token: Token): number {
        if (!precedenceTable.has(token.tokenType)) return -1;
        return precedenceTable.get(token.tokenType)!;
    }

    private parseExpr(currentPrec: number = 99) {
        let expr: ExprNode = this.parseAtom();
        while (!this.isEOF()) {
            const op = this.current();
            console.log(op);
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
        }
        throw new Error("UNDEFINED OPERATOR " + operator.repr);
    }

    private parseAtom(): ExprNode {
        const { tokenType, repr } = this.current();
        this.advance();
        switch (tokenType) {
            case ExprToken.LiteralNumber: return new ExprLiteralNumber(parseInt(repr));
            case ExprToken.LiteralString: return new ExprLiteralString(repr);
            case ExprToken.Identifier: return new ExprIdentifier(repr);
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

    private peek(): Token {
        return this.tokens[this.tokenPtr + 1];
    }
}

export const parse = (tokens: Token[]) => {
    const parser = new Parser(tokens);
    const ast = parser.start();
    console.log(ast);
    return ast;
}
