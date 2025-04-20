export class NotFoundError extends Error {
  constructor(title: string, key: string, value: string | number) {
    super(
      `The ${key} with the attribute ${key} and value ${value} does not exists `,
    );
    this.name = 'NotFoundError';
  }
}
