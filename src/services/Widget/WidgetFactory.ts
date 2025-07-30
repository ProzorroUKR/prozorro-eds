import { errorMessages } from "@/config/errorMessages";
import { WIDGET } from "@/config/widget";
import { Assert } from "@/utils/Assert";
import type { EndUser } from "@/types/IIT/Widget/LibraryInterface";

export interface IWidgetFactory {
  create(): Promise<EndUser.Instance>;
}

export class WidgetFactory implements IWidgetFactory {
  async create(): Promise<EndUser.Instance> {
    const widget = new (window as any).EndUser(
      WIDGET.ID.PARENT,
      WIDGET.ID.MAIN,
      WIDGET.PATH,
      (window as any).EndUser.FormType.ReadPKey
    );
    await this.load();
    return widget;
  }

  private load(): Promise<void> {
    const widgetIframe = document.getElementById(WIDGET.ID.MAIN);

    return new Promise(resolve => {
      Assert.isDefined(widgetIframe, errorMessages.widgetInit);
      widgetIframe.addEventListener("load", () => resolve());
    });
  }
}
