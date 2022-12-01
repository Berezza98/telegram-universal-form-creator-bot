module.exports = (ctx, next) => {
  const id = ctx.message.from.id.toString();
  ctx.state.isAdmin = id === process.env.ADMIN_ID;

  return next();
}