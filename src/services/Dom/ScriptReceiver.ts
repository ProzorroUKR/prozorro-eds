const SCRIPT_TAG = "script";
const SCRIPT_TYPE = "text/javascript";

export interface IScriptReceiver {
  insert(src: string, isAsync?: boolean, isDefer?: boolean): Promise<void>;
}

export class ScriptReceiver implements IScriptReceiver {
  insert(src: string, isAsync?: boolean, isDefer?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement(SCRIPT_TAG);
      document.body.appendChild(script);

      script.src = src;
      script.type = SCRIPT_TYPE;
      script.async = Boolean(isAsync);
      script.defer = Boolean(isDefer);
      // @ts-expect-error
      script.onload = resolve;
      script.onerror = reject;
    });
  }
}
