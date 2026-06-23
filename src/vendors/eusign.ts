import type { EndUser as Widget } from "@/types/IIT/Widget/LibraryInterface";
import type {CertificateType} from "@/types/IIT/Widget/CertificateType";
import type {FormType} from "@/types/IIT/Widget/config/FormType";
import type {EventType} from "@/types/IIT/Widget/config/EventType";
import type {SignAlgo} from "@/types/IIT/Widget/config/SignAlgo.ts";
import type {SignType} from "@/types/IIT/Widget/config/SignType.ts";
import type {PAdESSignLevel} from "@/types/IIT/Widget/config/PAdESSignLevel.ts";
import type {XAdESType} from "@/types/IIT/Widget/config/XAdESType.ts";
import type {XAdESSignLevel} from "@/types/IIT/Widget/config/XAdESSignLevel.ts";
import type {ASiCType} from "@/types/IIT/Widget/config/ASiCType.ts";
import type {ASiCSignType} from "@/types/IIT/Widget/config/ASiCSignType.ts";
import type {KeyUsage} from "@/types/IIT/Widget/config/KeyUsage.ts";
import type {PublicKeyType} from "@/types/IIT/Widget/config/PublicKeyType.ts";
import type {CertHashType} from "@/types/IIT/Widget/config/CertHashType.ts";
import type {CCSType} from "@/types/IIT/Widget/config/CCSType.ts";
import type {RevocationReason} from "@/types/IIT/Widget/config/RevocationReason.ts";
import type {FormParamsType} from "@/types/IIT/Widget/config/FormParamsType.ts";
import type {NamedDataType} from "@/types/IIT/Widget/NamedDataType.ts";
import type {ConfirmKSPOperationEventType} from "@/types/IIT/Widget/ConfirmKSPOperationEventType.ts";

/**
 * EUSign - Electronic Signature Widget Connector
 * Refactored to ES6 module with TypeScript support
 */

const s_debug = false;

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface EnvelopedDataInfo {
    senderInfo?: any;
    data: Uint8Array | string;
}

// ============================================================================
// Constants
// ============================================================================

export const FORM_TYPE: FormType = {
    ReadPKey: 1,
    MakeNewCertificate: 2,
    SignFile: 3,
    ViewPKeyCertificates: 4,
    MakeDeviceCertificate: 5
};

export const EVENT_TYPE: EventType = {
    ConfirmKSPOperation: 2
};

export const SIGN_ALGO: SignAlgo = {
    DSTU4145WithGOST34311: 1,
    RSAWithSHA: 2,
    ECDSAWithSHA: 3,
    DSTU4145WithDSTU7564: 4
};

export const SIGN_TYPE: SignType = {
    CAdES_BES: 1,
    CAdES_T: 4,
    CAdES_C: 8,
    CAdES_X_Long: 16,
    CAdES_X_Long_Trusted: 144
};

export const PADES_SIGN_LEVEL: PAdESSignLevel = {
    PAdES_B_B: 1,
    PAdES_B_T: 4
};

export const XADES_TYPE: XAdESType = {
    Detached: 1,
    Enveloped: 3
};

export const XADES_SIGN_LEVEL: XAdESSignLevel = {
    XAdES_B_B: 1,
    XAdES_B_T: 4,
    XAdES_B_LT: 16,
    XAdES_B_LTA: 32
};

export const ASIC_TYPE: ASiCType = {
    S: 1,
    E: 2
};

export const ASIC_SIGN_TYPE: ASiCSignType = {
    CAdES: 1,
    XAdES: 2
};

export const KEY_USAGE: KeyUsage = {
    DigitalSignature: 1,
    KeyAgreement: 16
};

export const PUBLIC_KEY_TYPE: PublicKeyType = {
    DSTU4145: 1,
    RSA: 2,
    ECDSA: 4
};

export const CERT_HASH_TYPE: CertHashType = {
    GOST34311: 1,
    SHA1: 2,
    SHA224: 3,
    SHA256: 4,
    SHA384: 5,
    SHA512: 6,
    DSTU7564_256: 7,
    DSTU7564_384: 8,
    DSTU7564_512: 9
};

export const CCS_TYPE: CCSType = {
    Revoke: 1,
    Hold: 2
};

export const REVOCATION_REASON: RevocationReason = {
    Unknown: 0,
    KeyCompromise: 1,
    NewIssued: 2
};

/**
 * Додатковий тип даних для передачі імені для даних
 */
export class NamedData implements NamedDataType {
    constructor(
        public name: string,
        public val: Uint8Array | string
    ) {}
}

/**
 * Додаткові параметри форми відображення віджету
 */
export class FormParams implements FormParamsType {
    ownCAOnly = false;
    showPKInfo = true;
    showSignTip = true;
    language = 'ua';
}

/**
 * Сповіщення про необхідність підтвердження операції з використання ос. ключа
 * за допомогою сканування QR-коду в мобільному додатку сервісу підпису
 */
export class ConfirmKSPOperationEvent implements ConfirmKSPOperationEventType {
    url = '';
    qrImage = '';
    mobileAppName = '';
}

// ============================================================================
// Message Types
// ============================================================================

interface Message {
    sender: string;
    reciever: string;
    id: number;
    cmd: string;
    params: any[];
}

interface MessageResponse {
    sender: string;
    reciever: string;
    id: number;
    error?: any;
    result?: any;
}

interface PromiseInfo {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    msg: Message;
}

export class EndUser implements Widget.Instance {
    readonly version: string = "20240701";
    private sender: string = "EndUserSignWidgetConnector";
    private reciever: string = "EndUserSignWidget";
    private parentId: string;
    private id: string;
    private src: string;
    private formType: number;
    private formParams: FormParamsType | null;
    private iframe: HTMLIFrameElement | null = null;
    private m_isIframeLoad: boolean = false;
    private m_promises: PromiseInfo[] = [];
    private m_listeners: { [key: number]: (event: any) => void } = [];
    // Deprecated constants (for backward compatibility)
    readonly FORM_TYPE_READ_PKEY = FORM_TYPE.ReadPKey;
    readonly FORM_TYPE_MAKE_NEW_CERTIFICATE = FORM_TYPE.MakeNewCertificate;
    readonly FORM_TYPE_SIGN_FILE = FORM_TYPE.SignFile;
    // Constants
    readonly FormType: FormType = FORM_TYPE;
    readonly EventType: EventType = EVENT_TYPE;
    readonly SignAlgo: SignAlgo = SIGN_ALGO;
    readonly SignType: SignType = SIGN_TYPE;
    readonly PAdESSignLevel: PAdESSignLevel = PADES_SIGN_LEVEL;
    readonly XAdESType: XAdESType = XADES_TYPE;
    readonly XAdESSignLevel: XAdESSignLevel = XADES_SIGN_LEVEL;
    readonly ASiCType: ASiCType = ASIC_TYPE;
    readonly ASiCSignType: ASiCSignType = ASIC_SIGN_TYPE;
    readonly KeyUsage: KeyUsage = KEY_USAGE;
    readonly PublicKeyType: PublicKeyType = PUBLIC_KEY_TYPE;
    readonly CertHashType: CertHashType = CERT_HASH_TYPE;
    readonly CCSType: CCSType = CCS_TYPE;
    readonly RevocationReason: RevocationReason = REVOCATION_REASON;

    /**
     * Constructor for creating SignWidget iframe interaction object
     * @param parentId - Parent element ID for iframe display
     * @param id - iframe ID that loads SignWidget page
     * @param src - URI address where SignWidget page is located
     * @param formType - Form type for display (see FormType constants)
     * @param formParams - Form parameters for display
     */
    constructor(
        /**
         * Ідентифікатор батківського елементу для відображення iframe,
         * який завантажує сторінку SignWidget
         */
        parentId: string,
        /**
         * Ідентифікатор iframe, який завантажує сторінку SignWidget
         */
        id: string,
        /**
         * URI з адресою за якою розташована сторінка SignWidget
         */
        src: string,
        /**
         * Тип форми для відображення (див. константи EndUser.FormType)
         */
        formType: number = 0,
        /**
         * Параметри форми для відображення (див. EndUser.FormParams)
         */
        formParams: FormParamsType | null = null
    ) {
        this.parentId = parentId;
        this.id = id;
        this.src = src;
        this.formType = formType;
        this.formParams = formParams;
        this.iframe = this._appendIframe(parentId, id, src);
    }

    /**
     * Destructor for removing SignWidget iframe interaction object
     */
    destroy(): void {
        if (this.iframe) {
            this._removeIframe(this.iframe, this.parentId);
            this.iframe = null;
        }
        this.m_promises = [];
    }

    // ============================================================================
    // Private Methods
    // ============================================================================

    private _parseURL(url: string): {
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        origin: string;
    } | null {
        const urlRegEx = new RegExp([
            '^(https?:)//',
            '(([^:/?#]*)(?::([0-9]+))?)',
            '(/{0,1}[^?]*)'
        ].join(''));

        const match = url.match(urlRegEx);

        if (!match) return null;

        return {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            origin: match[1] + '//' + match[2]
        };
    }

    private _appendIframe(
        parentId: string,
        id: string,
        src: string
    ): HTMLIFrameElement {
        const parsedOrigin = this._parseURL(window.location.href);

        let srcParams = '?address=' + (parsedOrigin?.origin || '');
        srcParams += '&formType=' + this.formType;
        srcParams += '&debug=' + false;

        if (this.formParams) {
            for (const paramName in this.formParams) {
                srcParams += '&' + paramName + '=' + (this.formParams as any)[paramName];
            }
        }

        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", src + srcParams);
        iframe.setAttribute("id", id);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowtransparency", "true");
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");

        const parentElement = document.getElementById(parentId);
        if (!parentElement) {
            throw new Error(`Parent element with id "${parentId}" not found`);
        }

        parentElement.appendChild(iframe);

        const origin = this._parseURL(src)?.origin;

        const listener = (event: MessageEvent) => {
            if (origin && event.origin !== origin) return;
            this._recieveMessage(event);
        };

        (iframe as any).listener = listener;
        window.addEventListener("message", listener, false);

        iframe.addEventListener("load", () => {
            this.m_isIframeLoad = true;

            if (s_debug) {
                console.log("iframe loaded");
            }

            const promises = this.m_promises;
            this.m_promises = [];

            promises.forEach((promise) => {
                this._postMessage(
                    promise.msg.cmd,
                    promise.msg.params,
                    promise.resolve,
                    promise.reject
                );
            });
        });

        return iframe;
    }

    private _removeIframe(iframe: HTMLIFrameElement, parentId: string): void {
        const listener = (iframe as any).listener;

        if (listener) {
            window.removeEventListener("message", listener);
            (iframe as any).listener = null;
        }

        const parentElement = document.getElementById(parentId);
        if (parentElement && iframe.parentNode === parentElement) {
            parentElement.removeChild(iframe);
        }
    }

    private _postMessage(
        cmd: string,
        params: any[],
        _resolve?: (value: any) => void,
        _reject?: (reason?: any) => void
    ): Promise<any> | undefined {
        let promise: Promise<any> | undefined;

        const msg: Message = {
            sender: this.sender,
            reciever: this.reciever,
            id: -1,
            cmd: cmd,
            params: params
        };

        if (typeof _resolve === 'undefined' && typeof _reject === 'undefined') {
            promise = new Promise((resolve, reject) => {
                msg.id = this.m_promises.push({
                    resolve: resolve,
                    reject: reject,
                    msg: msg
                });
            });
        } else if (_resolve && _reject) {
            msg.id = this.m_promises.push({
                resolve: _resolve,
                reject: _reject,
                msg: msg
            });
        }

        if (this.m_isIframeLoad) {
            try {
                const signWidget = document.getElementById(this.id) as HTMLIFrameElement;
                if (signWidget && signWidget.contentWindow) {
                    signWidget.contentWindow.postMessage(msg, this.src);
                }

                if (s_debug) {
                    console.log("Main page post message: ", msg);
                }
            } catch (e) {
                if (s_debug) {
                    console.log("Main page post message error: " + e);
                }
            }
        }

        return promise;
    }

    private _recieveMessage(event: MessageEvent): void {
        if (s_debug) {
            console.log("Main page receive message: ", event.data);
        }

        const data: MessageResponse = event.data;

        if (data.reciever !== this.sender || data.sender !== this.reciever) {
            return;
        }

        if (data.id === -1) {
            const promises = this.m_promises;
            this.m_promises = [];

            promises.forEach((promise) => {
                this._postMessage(
                    promise.msg.cmd,
                    promise.msg.params,
                    promise.resolve,
                    promise.reject
                );
            });

            return;
        } else if (data.id === -2) {
            const widgetEvent = data.result;
            if (this.m_listeners[widgetEvent.type]) {
                this.m_listeners[widgetEvent.type](widgetEvent);
            }
            return;
        }

        const p = this.m_promises[data.id - 1];
        if (!p) {
            return;
        }

        delete this.m_promises[data.id - 1];

        if (data.error) {
            p.reject(data.error);
        } else {
            p.resolve(data.result);
        }
    }

    /**
     * Register event listener for widget events
     * @param eventType - Event type (see EventType constants)
     * @param listener - Event handler function
     */
    AddEventListener(
        eventType: number,
        listener: (event: any) => void
    ): Promise<void> {
        this.m_listeners[eventType] = listener;
        const params = [eventType];
        return this._postMessage('AddEventListener', params) as Promise<void>;
    }

    /**
     * Reset (clear) the read private key
     */
    ResetPrivateKey(): Promise<void> {
        return this._postMessage('ResetPrivateKey', []) as Promise<void>;
    }

    /**
     * Read private key. Must be called before functions that use the private key
     * @returns Array of certificate information for the read private key
     */
    ReadPrivateKey(): Promise<CertificateType[]> {
        return this._postMessage('ReadPrivateKey', []) as Promise<CertificateType[]>;
    }

    /**
     * Generate new certificate for existing key
     * @param euParams - User information to change in new certificate
     */
    MakeNewCertificate(euParams?: any): Promise<void> {
        const params = euParams ? [euParams] : [];
        return this._postMessage('MakeNewCertificate', params) as Promise<void>;
    }

    /**
     * Generate device certificate using private key
     * @param certParams - Certificate parameters
     */
    MakeDeviceCertificate(certParams: any): Promise<void> {
        return this._postMessage('MakeDeviceCertificate', [certParams]) as Promise<void>;
    }

    /**
     * Change status of own certificate
     * @param ccsType - Change certificate status type
     * @param revocationReason - Revocation reason
     */
    ChangeOwnCertificatesStatus(
        ccsType: number,
        revocationReason: number
    ): Promise<void> {
        return this._postMessage(
            'ChangeOwnCertificatesStatus',
            [ccsType, revocationReason]
        ) as Promise<void>;
    }

    /**
     * Sign hash value(s)
     * @param hash - Hash value(s) to sign
     * @param asBase64String - Return signature as BASE64 string
     * @param signAlgo - Signature algorithm (see SignAlgo constants)
     * @param signType - Signature type (see SignType constants)
     * @param previousSign - Previous signature(s) to append to
     */
    SignHash(
        hash: Uint8Array | string | Array<Uint8Array | string>,
        asBase64String: boolean = false,
        signAlgo: number = SIGN_ALGO.DSTU4145WithGOST34311,
        signType: number = SIGN_TYPE.CAdES_BES,
        previousSign?: Uint8Array | string | Array<Uint8Array | string>
    ): Promise<Uint8Array | string | Array<Uint8Array | string>> {
        const params = [hash, asBase64String, signAlgo, signType, previousSign];
        return this._postMessage('SignHash', params) as Promise<any>;
    }

    /**
     * Sign data
     * @param data - Data to sign
     * @param external - Create external signature (data and signature stored separately)
     * @param asBase64String - Return signature as BASE64 string
     * @param signAlgo - Signature algorithm (see SignAlgo constants)
     * @param previousSign - Previous signature(s) to append to
     * @param signType - Signature type (see SignType constants)
     */
    SignData(
        data: Uint8Array | string | Array<Uint8Array | string>,
        external: boolean = true,
        asBase64String: boolean = false,
        signAlgo: number = SIGN_ALGO.DSTU4145WithGOST34311,
        previousSign?: Uint8Array | string | Array<Uint8Array | string>,
        signType: number = SIGN_TYPE.CAdES_BES
    ): Promise<Uint8Array | string | Array<Uint8Array | string>> {
        const params = [data, external, asBase64String, signAlgo, previousSign, signType];
        return this._postMessage('SignData', params) as Promise<any>;
    }

    /**
     * Encrypt data using GOST 28147-2009 and DSTU 4145-2002 key agreement protocol
     * @param recipientsCerts - Recipient certificates
     * @param data - Data to encrypt
     * @param signData - Additionally sign the data
     * @param asBase64String - Return encrypted data as BASE64 string
     * @param useDynamicKey - Use dynamic key of sender
     */
    EnvelopData(
        recipientsCerts: Uint8Array[],
        data: Uint8Array | string,
        signData: boolean = false,
        asBase64String: boolean = false,
        useDynamicKey: boolean = false
    ): Promise<Uint8Array | string> {
        const params = [recipientsCerts, data, signData, asBase64String, useDynamicKey];
        return this._postMessage('EnvelopData', params) as Promise<any>;
    }

    /**
     * Decrypt data using GOST 28147-2009 and DSTU 4145-2002 key agreement protocol
     * @param envelopedData - Encrypted data
     * @param senderCert - Sender certificate (optional)
     */
    DevelopData(
        envelopedData: Uint8Array | string,
        senderCert?: Uint8Array
    ): Promise<EnvelopedDataInfo> {
        const params = senderCert ? [envelopedData, senderCert] : [envelopedData];
        return this._postMessage('DevelopData', params) as Promise<EnvelopedDataInfo>;
    }

    /**
     * Sign PDF file in PAdES format
     * @param data - PDF document to sign (bytes or NamedData)
     * @param asBase64String - Return signature as BASE64 string
     * @param signAlgo - Signature algorithm (see SignAlgo constants)
     * @param signLevel - Signature level (see PAdESSignLevel constants)
     */
    PAdESSignData(
        data: Uint8Array | NamedData | Array<Uint8Array | NamedData>,
        asBase64String: boolean = false,
        signAlgo: number = SIGN_ALGO.DSTU4145WithGOST34311,
        signLevel: number = PADES_SIGN_LEVEL.PAdES_B_B
    ): Promise<Uint8Array | NamedData | string | Array<Uint8Array | NamedData | string>> {
        const params = [data, asBase64String, signAlgo, signLevel];
        return this._postMessage('PAdESSignData', params) as Promise<any>;
    }

    /**
     * Sign data in XAdES format
     * @param xadesType - Signature type (see XAdESType constants)
     * @param references - Array of NamedData to sign
     * @param asBase64String - Return signature as BASE64 string
     * @param signAlgo - Signature algorithm (see SignAlgo constants)
     * @param signLevel - Signature level (see XAdESSignLevel constants)
     */
    XAdESSignData(
        xadesType: number,
        references: NamedData[],
        asBase64String: boolean = false,
        signAlgo: number = SIGN_ALGO.DSTU4145WithGOST34311,
        signLevel: number = XADES_SIGN_LEVEL.XAdES_B_B
    ): Promise<NamedData> {
        const params = [xadesType, references, asBase64String, signAlgo, signLevel];
        return this._postMessage('XAdESSignData', params) as Promise<NamedData>;
    }

    /**
     * Sign data in ASiC format
     * @param asicType - Container format (see ASiCType constants)
     * @param signType - Signature type (see ASiCSignType constants)
     * @param references - Array of NamedData to sign
     * @param asBase64String - Return signature as BASE64 string
     * @param signAlgo - Signature algorithm (see SignAlgo constants)
     * @param signLevel - Signature level (SignType for CAdES or XAdESSignLevel for XAdES)
     */
    ASiCSignData(
        asicType: number,
        signType: number,
        references: NamedData[],
        asBase64String: boolean = false,
        signAlgo: number = SIGN_ALGO.DSTU4145WithGOST34311,
        signLevel?: number
    ): Promise<NamedData> {
        const params = [asicType, signType, references, asBase64String, signAlgo, signLevel];
        return this._postMessage('ASiCSignData', params) as Promise<NamedData>;
    }
}

export default { EndUser };