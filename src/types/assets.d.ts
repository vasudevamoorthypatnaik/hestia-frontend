// Asset module declarations (Metro resolves these to asset ids at bundle time).
declare module '*.ttf' {
  const content: number
  export default content
}
declare module '*.png' {
  const content: number
  export default content
}
