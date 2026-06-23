/**
 * Додатковий тип даних для передачі імені для даних
 */
export interface NamedDataType {
  /**
   * Ім'я даних (наприклад файла)
   */
  name: string;

  /**
   * Дані
   */
  val: Uint8Array | string;
}
