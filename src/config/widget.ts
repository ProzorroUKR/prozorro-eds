export const WIDGET = {
  ID: {
    /**
     * Ідентифікатор батківського елементу для відображення iframe,
     * який завантажує сторінку SignWidget
     */
    PARENT: "sign-widget-parent",

    /**
     * Ідентифікатор iframe, який завантажує сторінку SignWidget
     */
    MAIN: "sign-widget",
  },

  /**
   * URI з адресою за якою розташована сторінка SignWidget
   */
  PATH: import.meta.env.VITE_PATH_SIGN_WIDGET || "",
} as const;
