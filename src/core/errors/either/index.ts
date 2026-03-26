export type Either<L, R> = Left<L, R> | Right<L, R>

abstract class BaseEither<L, R, V extends L | R> {
  constructor(
    private readonly success: boolean,
    public readonly value: V,
  ) {}

  isLeft(): this is Left<L, R> {
    return !this.success
  }

  isRight(): this is Right<L, R> {
    return this.success
  }

  fold<T>(leftFn: (left: L) => T, rightFn: (right: R) => T): T {
    return this.isRight() 
      ? rightFn(this.value as R) 
      : leftFn(this.value as L)
  }

  unwrap(): R {
    if(this.isLeft()) {
      this.throw()
    }

    return this.value as R
  }
}

export class Left<L, R> extends BaseEither<L, R, L> {
  constructor(value: L) {
    super(false, value)
  }
  

  fold<T>(leftFn: (left: L) => T, rightFn: (right: R) => T): T {
    return leftFn(this.value)
  }
  
  throw(): never {
    throw this.value instanceof Error ? this.value : new Error(this.value!.toString())
  }
}

export class Right<L, R> extends BaseEither<L, R, R> {
  constructor(value: R) {
    super(true, value)
  }
}

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}

export const unwrap = <L, R>(either: Either<L, R>): R => {
  return either.unwrap()
}