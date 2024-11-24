import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { compose } from "decorator-compose";

void test("class", () => {
  function prefix(p: string) {
    // eslint-disable-next-line no-unused-vars
    return function <Class extends new (...args: any[]) => object>(
      value: Class,
    ) {
      return class extends value {
        toString() {
          return `${p}: ${super.toString()}`;
        }
      };
    };
  }
  // eslint-disable-next-line no-unused-vars
  function composed<Class extends new (...args: any[]) => any>(
    first: string,
    second: string,
  ) {
    return compose<Class>(prefix(first), prefix(second));
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

void describe("method", () => {
  function prefix(p: string) {
    // eslint-disable-next-line no-unused-vars
    return function <This>(value: (this: This, ...args: any[]) => string) {
      return function (this: This, ...args: any[]) {
        return `${p}: ${value.apply(this, args)}`;
      } satisfies typeof value;
    };
  }
  function composed<This>(first: string, second: string) {
    // eslint-disable-next-line no-unused-vars
    return compose<This, (this: This, ...args: any[]) => string>(
      prefix(first),
      prefix(second),
    );
  }

  void test("static method", () => {
    const arg = {};
    class Sut {
      @prefix("first")
      @prefix("second")
      static staticFoo(a: typeof arg) {
        assert.equal(this, Sut);
        assert.equal(a, arg);
        return "original";
      }
      @composed("first", "second")
      static staticBar(a: typeof arg) {
        assert.equal(this, Sut);
        assert.equal(a, arg);
        return "original";
      }
    }

    assert.equal(Sut.staticFoo(arg), "first: second: original");
    assert.equal(Sut.staticBar(arg), "first: second: original");
  });

  void test("instance method", () => {
    const arg = {};
    class Sut {
      @prefix("first")
      @prefix("second")
      foo(a: typeof arg) {
        assert.equal(this, sut);
        assert.equal(a, arg);
        return "original";
      }
      @composed("first", "second")
      bar(a: typeof arg) {
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

void describe("getter", () => {
  function prefix(p: string) {
    // eslint-disable-next-line no-unused-vars
    return function <This>(value: (this: This) => string) {
      // eslint-disable-next-line no-unused-vars
      return function (this: This) {
        return `${p}: ${value.call(this)}`;
      };
    };
  }
  function composed<This>(first: string, second: string) {
    return compose<This, string>(prefix(first), prefix(second));
  }

  void test("static getter", () => {
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

  void test("instance getter", () => {
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

void describe("setter", () => {
  function prefix(p: string) {
    // eslint-disable-next-line no-unused-vars
    return function <This>(value: (this: This, v: string) => void) {
      return function (this: This, v: string) {
        return value.call(this, `${p}: ${v}`);
      };
    };
  }
  function composed<This>(first: string, second: string) {
    return compose<This, string>(prefix(first), prefix(second));
  }

  void test("static setter", () => {
    class Sut {
      static _foo: string;
      @prefix("first")
      @prefix("second")
      static set foo(value: string) {
        assert.equal(this, Sut);
        this._foo = value;
      }

      static _bar: string;
      @composed("first", "second")
      static set bar(value: string) {
        assert.equal(this, Sut);
        this._bar = value;
      }
    }

    Sut.foo = "original";
    assert.equal(Sut._foo, "second: first: original");

    Sut.bar = "original";
    assert.equal(Sut._bar, "second: first: original");
  });

  void test("instance setter", () => {
    class Sut {
      _foo?: string;
      @prefix("first")
      @prefix("second")
      set foo(value: string) {
        assert.equal(this, sut);
        this._foo = value;
      }

      _bar?: string;
      @composed("first", "second")
      set bar(value: string) {
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

void describe("field", () => {
  function prefix(p: string) {
    // eslint-disable-next-line no-unused-vars
    return function (value: undefined) {
      return function (initialValue: string) {
        return `${p}: ${initialValue}`;
      };
    };
  }
  function composed<This>(first: string, second: string) {
    return compose<This, string>(prefix(first), prefix(second));
  }

  void test("static field", () => {
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

  void test("instance field", () => {
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

void describe("accessor", () => {
  function prefix(p: string) {
    return function <This>({
      get,
      set,
    }: ClassAccessorDecoratorTarget<This, string>) {
      return {
        // eslint-disable-next-line no-unused-vars
        get(this: This) {
          return `getter(${p}): ${get.call(this)}`;
        },
        set(this: This, value: string) {
          set.call(this, `setter(${p}): ${value}`);
        },
        init(initialValue: string) {
          return `init(${p}): ${initialValue}`;
        },
      };
    };
  }
  function composed<This>(first: string, second: string) {
    return compose<This, string>(prefix(first), prefix(second));
  }

  void test("static accessor", () => {
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

  void test("instance accessor", () => {
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
