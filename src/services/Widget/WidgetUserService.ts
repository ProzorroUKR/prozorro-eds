import type { IWidgetService } from "@/services/Widget/WidgetService";

export interface IWidgetUserService {
  resetKey(): Promise<void>;
}

export class WidgetUserService implements IWidgetUserService {
  constructor(private readonly widgetService: IWidgetService) {}

  public async resetKey(): Promise<void> {
    await this.widgetService.resetKey();
    this.widgetService.addReadKeyListener();
  }
}
