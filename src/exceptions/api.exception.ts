export class ApiException extends Error {
  status: number;
  messageKey: string;
  translate: boolean = true;
  /**
   * @param status HTTP response status code.
   * @param messageKey
   * @param options
   */
  constructor(
    status: number,
    messageKey: string,
    options: {
      translate?: boolean,
    } = {},
  ) {
    super();
    this.status = status;
    this.messageKey = messageKey;
    if (options?.translate === false){
      this.translate = false;
    }
    return this;
  }
  getStatus(): number {
    return this.status;
  }
}