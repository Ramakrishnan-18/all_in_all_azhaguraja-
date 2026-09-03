// Simple async error wrapper so controllers can be written with async/await
// without try/catch boilerplate.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
