import { expect, test } from "vitest";
import { ExprIdentifier, ExprNodeAnd, parse } from "../../lib/expr_parser";
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

// test("parses '5 < 10 && 2 > 5' correctly", () => {
//     const tokens = [
//         new Token(ExprToken.LiteralNumber, "5"),
//         new Token(ExprToken.LessThan, "<"),
//         new Token(ExprToken.LiteralNumber, "10"),
//         new Token(ExprToken.And, "&&"),
//         new Token(ExprToken.LiteralNumber, "2"),
//         new Token(ExprToken.GreaterThan, ">"),
//         new Token(ExprToken.LiteralNumber, "5"),
//     ];

//     const ast = parse(tokens);
//     expect(ast).toStrictEqual(
//         new ExprNodeAnd(
//             new ExprIdentifier("a"),
//             new ExprIdentifier("b"),
//         ),
//     );
// });

