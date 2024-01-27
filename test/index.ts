// @ts-nocheck
/*
 * This file must stay valid JS as it's processed by both TypeScript and Babel.
 * This means it cannot use type annotations or other generics notation, but
 * because it needs to be la .ts file to have decorators transformed by TypeScript
 * it cannot use JSDoc either, so TypeScript type-checking must be disabled/ignored.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { compose } from "../index.js";

test("class", () => {
  function prefix(p) {
    return function (value) {
      return class extends value {
        toString() {
          return `${p}: ${super.toString()}`;
        }
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  @prefix("first")
  @prefix("second")
  class Foo {
    toString() {
      assert(this === foo);
      return "original";
    }
  }
  @composed("first", "second")
  class Bar {
    toString() {
      assert(this === bar);
      return "original";
    }
  }

  const foo = new Foo();
  const bar = new Bar();

  assert.equal(foo.toString(), "first: second: original");
  assert.equal(bar.toString(), "first: second: original");
});

describe("method", () => {
  function prefix(p) {
    return function (value) {
      return function (...args) {
        return `${p}: ${value.apply(this, args)}`;
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  test("static method", () => {
    const arg = {};
    class Sut {
      @prefix("first")
      @prefix("second")
      static staticFoo(a) {
        assert.equal(this, Sut);
        assert.equal(a, arg);
        return "original";
      }
      @composed("first", "second")
      static staticBar(a) {
        assert.equal(this, Sut);
        assert.equal(a, arg);
        return "original";
      }
    }

    assert.equal(Sut.staticFoo(arg), "first: second: original");
    assert.equal(Sut.staticBar(arg), "first: second: original");
  });

  test("instance method", () => {
    const arg = {};
    class Sut {
      @prefix("first")
      @prefix("second")
      foo(a) {
        assert.equal(this, sut);
        assert.equal(a, arg);
        return "original";
      }
      @composed("first", "second")
      bar(a) {
        assert.equal(this, sut);
        assert.equal(a, arg);
        return "original";
      }
    }

    const sut = new Sut();

    assert.equal(sut.foo(arg), "first: second: original");
    assert.equal(sut.bar(arg), "first: second: original");
  });
});

describe("getter", () => {
  function prefix(p) {
    return function (value) {
      return function () {
        return `${p}: ${value.call(this)}`;
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  test("static getter", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      static get foo() {
        assert.equal(this, Sut);
        return "original";
      }

      @composed("first", "second")
      static get bar() {
        assert.equal(this, Sut);
        return "original";
      }
    }

    assert.equal(Sut.foo, "first: second: original");
    assert.equal(Sut.bar, "first: second: original");
  });

  test("instance getter", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      get foo() {
        assert.equal(this, sut);
        return "original";
      }

      @composed("first", "second")
      get bar() {
        assert.equal(this, sut);
        return "original";
      }
    }

    const sut = new Sut();

    assert.equal(sut.foo, "first: second: original");
    assert.equal(sut.bar, "first: second: original");
  });
});

describe("setter", () => {
  function prefix(p) {
    return function (value, context) {
      return function (v) {
        return value.call(this, `${p}: ${v}`);
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  test("static setter", () => {
    class Sut {
      static _foo;
      @prefix("first")
      @prefix("second")
      static set foo(value) {
        assert.equal(this, Sut);
        this._foo = value;
      }

      static _bar;
      @composed("first", "second")
      static set bar(value) {
        assert.equal(this, Sut);
        this._bar = value;
      }
    }

    Sut.foo = "original";
    assert.equal(Sut._foo, "second: first: original");

    Sut.bar = "original";
    assert.equal(Sut._bar, "second: first: original");
  });

  test("instance setter", () => {
    class Sut {
      _foo;
      @prefix("first")
      @prefix("second")
      set foo(value) {
        assert.equal(this, sut);
        this._foo = value;
      }

      _bar;
      @composed("first", "second")
      set bar(value) {
        assert.equal(this, sut);
        this._bar = value;
      }
    }

    const sut = new Sut();

    sut.foo = "original";
    assert.equal(sut._foo, "second: first: original");

    sut.bar = "original";
    assert.equal(sut._bar, "second: first: original");
  });
});

describe("field", () => {
  function prefix(p) {
    return function (value, context) {
      return function (initialValue) {
        return `${p}: ${initialValue}`;
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  test("static field", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      static foo = "original";

      @composed("first", "second")
      static bar = "original";
    }

    assert.equal(Sut.foo, "second: first: original");
    assert.equal(Sut.bar, "second: first: original");
  });

  test("instance field", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      foo = "original";

      @composed("first", "second")
      bar = "original";
    }

    const sut = new Sut();

    assert.equal(sut.foo, "second: first: original");
    assert.equal(sut.bar, "second: first: original");
  });
});

describe("accessor", () => {
  function prefix(p) {
    return function ({ get, set }, context) {
      return {
        get() {
          return `getter(${p}): ${get.call(this)}`;
        },
        set(value) {
          set.call(this, `setter(${p}): ${value}`);
        },
        init(initialValue) {
          return `init(${p}): ${initialValue}`;
        },
      };
    };
  }
  function composed(first, second) {
    return compose(prefix(first), prefix(second));
  }

  test("static accessor", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      static accessor foo = "original";

      @composed("first", "second")
      static accessor bar = "original";
    }

    assert.equal(
      Sut.foo,
      "getter(first): getter(second): init(second): init(first): original",
    );
    assert.equal(
      Sut.bar,
      "getter(first): getter(second): init(second): init(first): original",
    );

    Sut.foo = "assigned";
    assert.equal(
      Sut.foo,
      "getter(first): getter(second): setter(second): setter(first): assigned",
    );
    Sut.bar = "assigned";
    assert.equal(
      Sut.bar,
      "getter(first): getter(second): setter(second): setter(first): assigned",
    );
  });

  test("instance accessor", () => {
    class Sut {
      @prefix("first")
      @prefix("second")
      accessor foo = "original";

      @composed("first", "second")
      accessor bar = "original";
    }

    const sut = new Sut();

    assert.equal(
      sut.foo,
      "getter(first): getter(second): init(second): init(first): original",
    );
    assert.equal(
      sut.bar,
      "getter(first): getter(second): init(second): init(first): original",
    );

    sut.foo = "assigned";
    assert.equal(
      sut.foo,
      "getter(first): getter(second): setter(second): setter(first): assigned",
    );
    sut.bar = "assigned";
    assert.equal(
      sut.bar,
      "getter(first): getter(second): setter(second): setter(first): assigned",
    );
  });
});
