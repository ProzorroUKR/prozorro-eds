/**
 * Типи алгоритмів підпису
 */
export type SignAlgo = {
  /**
   * ДСТУ4145 з використанням алгоритму гешування ГОСТ34310
   */
  DSTU4145WithGOST34311: number;

  /**
   * RSA з використанням алгоритму гешування SHA256
   */
  RSAWithSHA: number;

  /**
   * ECDSA з використанням алгоритму гешування SHA256
   */
  ECDSAWithSHA: number;
};
