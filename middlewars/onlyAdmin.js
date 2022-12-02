module.exports = (ctx, next) => {
  if (!ctx.state.isAdmin) return;

  return next();
}