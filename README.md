# decorator-compose

This library exposes a helper function to create a composed decorator.
Only standard decorators are supported, not TypeScript _experimental_ decorators.

## Use-case

There are cases where you'd want to apply always the same set of decorators together to a class or class member.
Rather than make sure you always follow that rule in your files (I suppose you could write an ESLint rule for that),
you can instead declare a _composed decorator_ that, well, composes that set of decorators and applies them whenever the composed decorator is applied.

This means that instead of:

```js
class Foo {
  @dec1 @dec2("option") @dec3 accessor bar;
}
```

you could write:

```js
class Foo {
  @composedDecorator accessor bar;
}
```

or

```js
class Foo {
  @composedDecorator("option") accessor bar;
}
```

with the exact same behavior.

## Usage

First, import the `compose` function:

```js
import { compose } from "decorator-compose";
```

The function takes a list of decorators and returns a decorator.

For a decorator with no argument, the returned decorator can be stored in a variable:

```js
const composedDecorator = compose(dec1, dec2("option"), dec3);

class Foo {
  @composedDecorator accessor bar;
}
```

For a decorator with arguments, create a function that returns the composed decorator:

```js
function composedDecorator(option) {
  return composed(dec1, dec2(option), dec3);
}

class Foo {
  @composedDecorator("option") accessor bar;
}
```

### Usage with TypeScript

The library function comes with typings for TypeScript,
that will make sure that passed in decorators are compatible with each others,
and return an correctly typed decorator.

There are times where TypeScript's **type inference** doesn't work though,
and you have to lend it a hand being explicit with its generic arguments.
