import { WidgetEndUser } from "@/store/modules/WidgetEndUser";
import { UserOptions } from "@/store/modules/UserOptions";
import type { IUserOptions } from "@/store/modules/UserOptions.ts";
import type { IWidgetEndUser } from "@/store/modules/WidgetEndUser.ts";

export interface IStore {
  userOptions: IUserOptions;
  widget: IWidgetEndUser;
}

export class Store implements IStore {
  public widget = new WidgetEndUser();
  public userOptions = new UserOptions();
}
