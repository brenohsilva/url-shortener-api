export class AlreadyExistsError extends Error {
  constructor(title: string, key: string, value: string | number) {
    super(
      `The ${key} with the attribute ${key} and value ${value} already exists `,
    );
    this.name = 'AlreadyExistsError';
  }
}
