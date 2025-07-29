/**
 * Причина відкликання власного сертифіката користувача
 */
export type RevocationReason = {
  /**
   * Невизначена
   */
  Unknown: number;

  /**
   * Компрометація ос. ключа
   */
  KeyCompromise: number;

  /**
   * Формування нового ос. ключа
   */
  NewIssued: number;
};
