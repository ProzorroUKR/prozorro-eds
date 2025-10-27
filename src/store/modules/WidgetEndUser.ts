import type { EndUser } from "@/types/IIT/Widget/LibraryInterface";

export interface IWidgetEndUser {
  endUser: EndUser.Instance | undefined;
}

export class WidgetEndUser implements IWidgetEndUser {
  private _endUser?: EndUser.Instance;

  get endUser(): EndUser.Instance | undefined {
    return this._endUser;
  }

  set endUser(data: EndUser.Instance | undefined) {
    this._endUser = data;
  }
}
