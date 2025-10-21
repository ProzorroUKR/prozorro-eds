import { WIDGET } from "@/config/widget";
import { Assert } from "@/utils/Assert";
import { EndUser, FORM_TYPE } from "@/vendors/eusign";
import { errorMessages } from "@/config/errorMessages";

export interface IWidgetFactory {
  create(): Promise<EndUser>;
}

export class WidgetFactory implements IWidgetFactory {
  async create(): Promise<EndUser> {
    const widget = new EndUser(WIDGET.ID.PARENT, WIDGET.ID.MAIN, WIDGET.PATH, FORM_TYPE.ReadPKey);
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
