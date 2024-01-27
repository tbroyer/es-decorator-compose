export declare function compose<
  Class extends
    DecoratorTypes.AbstractConstructor = DecoratorTypes.AbstractConstructor,
>(
  ...decorators: DecoratorTypes.ClassDecorator<Class>[]
): DecoratorTypes.ClassDecorator<Class>;
export declare function compose<
  This = unknown,
  Value extends DecoratorTypes.Method<This> = DecoratorTypes.Method<This>,
>(
  ...decorators: DecoratorTypes.ClassMethodDecorator<This, Value>[]
): DecoratorTypes.ClassMethodDecorator<This, Value>;
export declare function compose<This = unknown, Value = unknown>(
  ...decorators: DecoratorTypes.ClassGetterDecorator<This, Value>[]
): DecoratorTypes.ClassGetterDecorator<This, Value>;
export declare function compose<This = unknown, Value = unknown>(
  ...decorators: DecoratorTypes.ClassSetterDecorator<This, Value>[]
): DecoratorTypes.ClassSetterDecorator<This, Value>;
export declare function compose<This = unknown, Value = unknown>(
  ...decorators: DecoratorTypes.ClassFieldDecorator<This, Value>[]
): DecoratorTypes.ClassFieldDecorator<This, Value>;
export declare function compose<This = unknown, Value = unknown>(
  ...decorators: DecoratorTypes.ClassAccessorDecorator<This, Value>[]
): DecoratorTypes.ClassAccessorDecorator<This, Value>;

declare namespace DecoratorTypes {
  type AbstractConstructor<Base = unknown> = abstract new (
    ...args: any
  ) => Base;
  type Constructor<Base = unknown> = new (...args: any) => Base;
  type Method<This = unknown> = (this: This, ...args: any) => any;
  type Getter<This = unknown, Value = unknown> = (this: This) => Value;
  type Setter<This = unknown, Value = unknown> = (
    this: This,
    value: Value,
  ) => void;
  type Initializer<This = unknown, Value = unknown> = (
    this: This,
    value: Value,
  ) => Value;

  // Types inspired by https://github.com/tc39/proposal-decorators

  type ClassDecorator<Base extends AbstractConstructor> = <Value extends Base>(
    value: Value,
    context: ClassDecoratorContext<Value>,
  ) => Value | void;

  type ClassMethodDecorator<
    This = unknown,
    Value extends Method<This> = Method<This>,
  > = (
    value: Value,
    context: ClassMethodDecoratorContext<This, Value>,
  ) => Value | void;

  type ClassGetterDecorator<This = unknown, Value = unknown> = (
    value: Getter<This, Value>,
    context: ClassGetterDecoratorContext<This, Value>,
  ) => Getter<This, Value> | void;

  type ClassSetterDecorator<This = unknown, Value = unknown> = (
    value: Setter<This, Value>,
    context: ClassSetterDecoratorContext<This, Value>,
  ) => Setter<This, Value> | void;

  type ClassFieldDecorator<This = unknown, Value = unknown> = (
    value: undefined,
    context: ClassFieldDecoratorContext<This, Value>,
  ) => Initializer<This, Value> | void;

  type ClassAccessorDecorator<This = unknown, Value = unknown> = (
    value: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ) => ClassAccessorDecoratorResult<This, Value> | void;
}
