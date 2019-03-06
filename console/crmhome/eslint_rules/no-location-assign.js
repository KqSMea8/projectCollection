/* eslint-disable */

/**
 * 计算字符串表达式是否以 # 开头，考虑了模板字符串和字符串加法表达式的情况
 */
function ExprStartsWithHash(node) {
  if (node.type === 'TemplateLiteral' && node.quasis[0].value.raw[0] === '#') {
    return true;
  }
  var firstNode = node;
  while (firstNode.type === 'BinaryExpression') {
    firstNode = firstNode.left;
  }
  if (firstNode.type === 'Literal' && firstNode.value[0] === '#') {
    return true;
  }
  return false;
}

/**
 * 商家中心禁止直接使用 location.href 进行跳转，因为大多数页面都需要 op_merchant_id 参数，应该调用 customLocation 方法拼装
 */
module.exports = function (context) {
  return {
    "CallExpression": function (node) {
      var callee = node.callee;
      if (callee.type === 'MemberExpression' &&
        (callee.property.name === 'assign' || callee.property.name === 'replace') &&
        (callee.object.name === 'location' ||
          (callee.object.type === 'MemberExpression' &&
            (callee.object.object.name === 'window' && callee.object.property.name === 'location')))) {
        var arg = node.arguments[0];
        if (!(arg && ExprStartsWithHash(arg))) {
          context.report({
            node: node,
            message: "Disallow calling location.assign or location.replace（商家中心嵌入中台时，直接跳转会遗漏op_merchant_id参数，推荐使用common/utils中的customLocation跳转方法）"
          });
        }
      }
    },

    "AssignmentExpression": function (node) {
      var left = node.left;
      if (left.type === "MemberExpression" && left.property.name === 'href' &&
        (left.object.name === 'location' ||
          (left.object.type === 'MemberExpression' &&
            (left.object.object.name === 'window' && left.object.property.name === 'location')))) {
        if (!(node.right && ExprStartsWithHash(node.right))) {
          context.report({
            node: node,
            message: "Disallow assignment to location.href（商家中心嵌入中台时，直接跳转会遗漏op_merchant_id参数，推荐使用common/utils中的customLocation跳转方法）"
          });
        }
      }
    }
  };
};

module.exports.schema = [
  {
    "enum": [0, 1, 2]
  }
];
