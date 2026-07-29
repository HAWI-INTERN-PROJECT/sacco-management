export default {
  '*.{ts,tsx}': ['oxlint --fix', 'tsc --noEmit --pretty'],
  '*.{json,css,md}': ['prettier --write'],
}
