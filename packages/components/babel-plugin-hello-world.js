// scripts/babel-plugin-hello-world.js
module.exports = function () {
  return {
    visitor: {
      Program(path) {
        path.unshiftContainer("body", {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: { type: "Identifier", name: "console" },
              property: { type: "Identifier", name: "log" },
            },
            arguments: [
              {
                type: "StringLiteral",
                value: "Hello from custom Babel plugin!",
              },
            ],
          },
        });
      },
    },
  };
};
