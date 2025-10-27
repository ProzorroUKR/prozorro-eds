/**
 * Тип запиту для зміни статусу власного сертифіката користувача
 */
export type CCSType = {
  /**
   * Revoke - відкликання
   */
  Revoke: number;

  /**
   * Hold - блокування
   */
  Hold: number;
};
