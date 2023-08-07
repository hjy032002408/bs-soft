// 判断这个菜单的路径是否为一个外链，是返回true
// 查看这个 path 是否有 http 或者 https 等前缀
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
