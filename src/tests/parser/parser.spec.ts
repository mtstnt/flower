import { expect, test } from "vitest";
import { ExprIdentifier, ExprLiteralNumber, ExprNodeAnd, ExprNodeComparison, parse } from "../../lib/expr_parser";
import { ExprToken, Token } from "../../lib/expr_tokenizer";

test("parses 'a && b' correctly", () => {
    const tokens = [
        new Token(ExprToken.Identifier, "a"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.Identifier, "b")
    ];
    const ast = parse(tokens);
    expect(ast).toStrictEqual(
        new ExprNodeAnd(
            new ExprIdentifier("a"),
            new ExprIdentifier("b"),
        ),
    );
});

test("parses 'a && b && c' correctly", () => {
    const tokens = [
        new Token(ExprToken.Identifier, "a"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.Identifier, "b"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.Identifier, "c")
    ];
    const ast = parse(tokens);
    expect(ast).toStrictEqual(
        new ExprNodeAnd(
            new ExprIdentifier("a"),
            new ExprNodeAnd(
                new ExprIdentifier("b"),
                new ExprIdentifier("c"),
            ),
        ),
    );
});

test("parses '5 < 10 && 2 > 5' correctly", () => {
    const tokens = [
        new Token(ExprToken.LiteralNumber, "5"),
        new Token(ExprToken.LessThan, "<"),
        new Token(ExprToken.LiteralNumber, "10"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.LiteralNumber, "2"),
        new Token(ExprToken.GreaterThan, ">"),
        new Token(ExprToken.LiteralNumber, "5"),
    ];

    const ast = parse(tokens);
    expect(ast).toStrictEqual(
        new ExprNodeAnd(
            new ExprNodeComparison("<",
                new ExprLiteralNumber("5"),
                new ExprLiteralNumber("10"),
            ),
            new ExprNodeComparison(">",
                new ExprLiteralNumber("2"),
                new ExprLiteralNumber("5"),
            ),
        ),
    );
});

test("parses '2 * (3 + 5)' correctly", () => {
    const tokens = [
        new Token(ExprToken.LiteralNumber, "2"),
        new Token(ExprToken.Asterisk, "*"),
        new Token(ExprToken.LeftParenthesis, "("),
        new Token(ExprToken.LiteralNumber, "3"),
        new Token(ExprToken.Plus, "+"),
        new Token(ExprToken.LiteralNumber, "5"),
        new Token(ExprToken.RightParenthesis, ")"),
    ];

    const ast = parse(tokens);
    expect(ast).toStrictEqual(
        null
    );
});

