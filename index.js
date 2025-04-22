export function compose(...decorators) {
  return function (value, context) {
    let kind = context.kind;
    let newValue = kind === "accessor" ? { ...value } : value;
    let initializers = [];
    for (let i = decorators.length - 1; i >= 0; i--) {
      let result = decorators[i].call(this, newValue, cloneContext(context));
      if (result === undefined) continue;
      switch (kind) {
        case "field":
        case "parameter":
          initializers.push(result);
          break;
        case "accessor":
          if (result === null || typeof result !== "object") {
            throw new TypeError("Object expected");
          }
          {
            let { get, set, init } = result;
            if (get !== undefined) newValue.get = assertCallable(get);
            if (set !== undefined) newValue.set = assertCallable(set);
            if (init !== undefined) initializers.push(assertCallable(init));
          }
          break;
        default:
          newValue = assertCallable(result);
      }
    }
    let runInitializers;
    switch (initializers.length) {
      case 0:
        break;
      case 1:
        runInitializers = initializers[0];
        break;
      default:
        runInitializers = function (initialValue) {
          for (let i = initializers.length - 1; i >= 0; i--) {
            initialValue = initializers[i].call(this, initialValue);
          }
          return initialValue;
        };
    }
    switch (kind) {
      case "field":
      case "parameter":
        return runInitializers;
      case "accessor":
        if (runInitializers) {
          newValue.init = runInitializers;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        return newValue;
    }
  };
}

function assertCallable(f) {
  if (typeof f !== "function") {
    throw new TypeError("Function expected");
  }
  return f;
}

function cloneContext(ctx) {
  ctx = { ...ctx };
  if (ctx.access) ctx.access = { ...ctx.access };
  if (ctx.function) ctx.function = { ...ctx.function };
  return ctx;
}
