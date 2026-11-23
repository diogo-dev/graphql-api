import { validate } from "class-validator";

export async function validateDto<T extends object>(
  DtoClass: new () => T,
  data: Partial<T>,
  options: { partial?: boolean } = {}
): Promise<T> {
  const instance = Object.assign(new DtoClass(), data);
  const errors = await validate(instance, {
    skipMissingProperties: options.partial ?? false,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap(err => Object.values(err.constraints ?? {}));
    throw new Error(`Validation failed: ${messages.join("; ")}`);
  }

  return instance;
}
