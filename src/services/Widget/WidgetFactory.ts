import { Assert } from "@/utils/Assert";
import { EndUser, FORM_TYPE } from "@/vendors/eusign";
import { errorMessages } from "@/config/errorMessages";

export interface IWidgetFactory {
  create(): Promise<EndUser>;
}

export class WidgetFactory implements IWidgetFactory {
  constructor(
    private readonly parentId: string,
    private readonly frameId: string,
    private readonly widgetUrl: string
  ) {}

  async create(): Promise<EndUser> {
    const widget = new EndUser(this.parentId, this.frameId, this.widgetUrl, FORM_TYPE.ReadPKey);
    await this.load();
    return widget;
  }

  private load(): Promise<void> {
    const widgetIframe = document.getElementById(this.frameId);

    return new Promise(resolve => {
      Assert.isDefined(widgetIframe, errorMessages.widgetInit);
      widgetIframe.addEventListener("load", () => resolve());
    });
  }
}
