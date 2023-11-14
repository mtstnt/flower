import { expect, test } from "vitest";
import { ExprToken, Token, tokenize } from "../../lib/expr_tokenizer";

test("tokenizes 'a && b || c'", () => {
    const tokens = tokenize("a && b || c");
    expect(tokens).toStrictEqual([
        new Token(ExprToken.Identifier, "a"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.Identifier, "b"),
        new Token(ExprToken.Or, "||"),
        new Token(ExprToken.Identifier, "c"),
    ]);
});

test("tokenizes '-a + b'", () => {
    const tokens = tokenize("-a + b");
    expect(tokens).toStrictEqual([
        new Token(ExprToken.Minus, "-"),
        new Token(ExprToken.Identifier, "a"),
        new Token(ExprToken.Plus, "+"),
        new Token(ExprToken.Identifier, "b"),
    ]);
});

test("tokenizes '5 < 10 && 2 > 5'", () => {
    const tokens = tokenize("5 < 10 && 2 > 5");
    expect(tokens).toStrictEqual([
        new Token(ExprToken.LiteralNumber, "5"),
        new Token(ExprToken.LessThan, "<"),
        new Token(ExprToken.LiteralNumber, "10"),
        new Token(ExprToken.And, "&&"),
        new Token(ExprToken.LiteralNumber, "2"),
        new Token(ExprToken.GreaterThan, ">"),
        new Token(ExprToken.LiteralNumber, "5"),
    ]);
});


