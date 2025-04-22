import {
  expectError,
  expectAssignable,
  expectType,
  expectNotAssignable,
} from "tsd";
import { ReactiveElement } from "lit";
import {
  customElement,
  eventOptions,
  property,
  state,
} from "lit/decorators.js";
import {
  parameters,
  parameter,
  type ClassMethodParameterDecoratorContext,
} from "parameters-decorator";
import { compose, type DecoratorTypes } from "decorator-compose";

abstract class Base extends ReactiveElement {}
abstract class Intermediate extends Base {}
class Subclass extends Intermediate {}

//
// Declare test decorators, and test the Class*Decorator types against them.
//

const classDec = <T extends new (...args: any[]) => Base>(
  value: T,
  context: ClassDecoratorContext<T>,
) => {
  return class DecoratedClass extends value {};
};
expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Base>>
>(classDec);
expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Intermediate>>
>(classDec);
expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Subclass>>
>(classDec);
// Base and Intermediate are abstract classes
expectNotAssignable<DecoratorTypes.ClassDecorator<typeof Base>>(classDec);
expectNotAssignable<DecoratorTypes.ClassDecorator<typeof Intermediate>>(
  classDec,
);
expectAssignable<DecoratorTypes.ClassDecorator<typeof Subclass>>(classDec);

const abstractClassDec = <T extends abstract new (...args: any[]) => Base>(
  value: T,
  context: ClassDecoratorContext<T>,
) => {
  abstract class DecoratedClass extends value {}
  return DecoratedClass;
};
expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.AbstractConstructor<Base>>
>(abstractClassDec);
expectAssignable<
  DecoratorTypes.ClassDecorator<
    DecoratorTypes.AbstractConstructor<Intermediate>
  >
>(abstractClassDec);
expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.AbstractConstructor<Subclass>>
>(abstractClassDec);
expectAssignable<DecoratorTypes.ClassDecorator<typeof Base>>(abstractClassDec);
expectAssignable<DecoratorTypes.ClassDecorator<typeof Intermediate>>(
  abstractClassDec,
);
expectAssignable<DecoratorTypes.ClassDecorator<typeof Subclass>>(
  abstractClassDec,
);

const methodDec = (
  value: (this: Base, a: string, b: number) => boolean,
  context: ClassMethodDecoratorContext<
    Base,
    (this: Base, a: string, b: number) => boolean
  >,
) => {};
expectAssignable<
  DecoratorTypes.ClassMethodDecorator<Base, (a: string, b: number) => boolean>
>(methodDec);

const getterDec = (
  value: (this: Base) => number,
  context: ClassGetterDecoratorContext<Base, number>,
) => {};
expectAssignable<DecoratorTypes.ClassGetterDecorator<Base, number>>(getterDec);

const setterDec = (
  value: (this: Base, value: number) => void,
  context: ClassSetterDecoratorContext<Base, number>,
) => {};
expectAssignable<DecoratorTypes.ClassSetterDecorator<Base, number>>(setterDec);

const accessorDec = (
  value: ClassAccessorDecoratorTarget<Base, bigint>,
  context: ClassAccessorDecoratorContext<Base, bigint>,
) => {};
expectAssignable<DecoratorTypes.ClassAccessorDecorator<Base, bigint>>(
  accessorDec,
);

const fieldDec = (
  value: undefined,
  context: ClassFieldDecoratorContext<Base, boolean>,
) => {};
expectAssignable<DecoratorTypes.ClassFieldDecorator<Base, boolean>>(fieldDec);

const paramDec = (
  value: undefined,
  context: ClassMethodParameterDecoratorContext<
    undefined | Base | (abstract new (...args: any[]) => Base)
  >,
) =>
  function (value: number) {
    return value * 2;
  };
expectAssignable<DecoratorTypes.ClassMethodParameterDecorator<Base, number>>(
  paramDec,
);
expectAssignable<
  DecoratorTypes.ClassMethodParameterDecorator<typeof Base, number>
>(paramDec);
expectAssignable<
  DecoratorTypes.ClassMethodParameterDecorator<Intermediate, number>
>(paramDec);
expectAssignable<
  DecoratorTypes.ClassMethodParameterDecorator<typeof Intermediate, number>
>(paramDec);
expectAssignable<
  DecoratorTypes.ClassMethodParameterDecorator<Subclass, number>
>(paramDec);
expectAssignable<
  DecoratorTypes.ClassMethodParameterDecorator<typeof Subclass, number>
>(paramDec);

//
// Declare composed decorators, and test their compatibility when applied.
// (this actually tests applicability of Class*Decorator types as decorators)
//

const composedClassDec = <T extends DecoratorTypes.Constructor<Base>>(
  name: string,
) => compose<T>(classDec, customElement(name));
expectType<DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Base>>>(
  composedClassDec("test-element"),
);
expectType<
  DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Intermediate>>
>(composedClassDec("test-element"));
(
  @composedClassDec("test-element")
  class extends Base {}
);
(
  @composedClassDec("test-element")
  class extends Intermediate {}
);
expectError(
  @composedClassDec("test-element")
  class {},
);
expectError(() => {
  @composedClassDec("test-element")
  abstract class Test extends Base {}
});

const composedClassDec2 = compose<DecoratorTypes.Constructor<Base>>(
  classDec,
  abstractClassDec,
);
expectType<DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<Base>>>(
  composedClassDec2,
);
(
  @composedClassDec2
  class extends Base {}
);
(
  @composedClassDec2
  class extends Intermediate {}
);
expectError(
  @composedClassDec2
  class {},
);
expectError(() => {
  @composedClassDec2
  abstract class Test extends Base {}
});

const composedMethodDec = compose(methodDec, eventOptions({}));
expectType<
  DecoratorTypes.ClassMethodDecorator<
    Base,
    (this: Base, a: string, b: number) => boolean
  >
>(composedMethodDec);

// TODO: find an in-the-wild getter decorator to compose here
const composedGetterDec = compose(getterDec);
expectType<DecoratorTypes.ClassGetterDecorator<Base, number>>(
  composedGetterDec,
);

const composedSetterDec = compose(setterDec, state({}));
expectType<DecoratorTypes.ClassSetterDecorator<Base, number>>(
  composedSetterDec,
);

const composedAccessorDec = compose(accessorDec, property());
expectType<DecoratorTypes.ClassAccessorDecorator<Base, bigint>>(
  composedAccessorDec,
);

// TODO: find an in-the-wild field decorator to compose here
const composedFieldDec = compose(fieldDec);
expectType<DecoratorTypes.ClassFieldDecorator<Base, boolean>>(composedFieldDec);

// TODO: find an in-the-wild field decorator to compose here
const composedParamDec = compose(paramDec);

// This applies each decorator independently, to make sure types are OK,
// then applies the "composed decorator", to check its own type (already
// checked explicitly above, but still)

@classDec
@abstractClassDec
@customElement("test-element")
@composedClassDec("test-element")
@composedClassDec2
@parameters([paramDec, composedParamDec])
class Foo extends Base {
  constructor(param1: number) {
    super();
  }

  @methodDec
  @eventOptions({})
  @composedMethodDec
  @parameters(undefined, [paramDec, composedParamDec])
  method(a: string, b: number) {
    return false;
  }

  @getterDec
  @composedGetterDec
  get prop1() {
    return 42;
  }

  @setterDec
  @state({})
  @composedSetterDec
  @parameter(paramDec, composedParamDec)
  set prop1(value: number) {}

  @accessorDec
  @property({ attribute: false })
  @composedAccessorDec
  accessor prop2 = 42n;

  @fieldDec
  @composedFieldDec
  field = false;
}

expectAssignable<DecoratorTypes.ClassAccessorDecorator>(property());
expectAssignable<DecoratorTypes.ClassAccessorDecorator<Base, bigint>>(
  compose(accessorDec, property()),
);
expectAssignable<DecoratorTypes.ClassSetterDecorator>(property());
expectNotAssignable<DecoratorTypes.ClassGetterDecorator>(property());

expectError(compose(getterDec, setterDec));

expectAssignable<
  DecoratorTypes.ClassDecorator<DecoratorTypes.Constructor<HTMLElement>>
>(customElement("test-element"));
