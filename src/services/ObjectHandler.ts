import axios from "axios";
import { DiffPatcher, create } from "jsondiffpatch";
import { DOCUMENTS_SIGN } from "@/config/compareSign";
import { errorMessages } from "@/config/errorMessages";
import { EdsError } from "@/services/Error/EdsError";
import type { FileType } from "@/types/FileType";
import type { DocumentType } from "@/types/DocumentType";
import type { VerifyDocumentType } from "@/types/VerifyDocumentType";
import type { VerifyObjectResponseType } from "@/types/VerifyObjectResponseType";
import { BlobHandler } from "@/utils/BlobHandler";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import type { ILogger } from "@/utils/Logger";
import type { ISignService } from "@/services/SignService";
import type { IFormattedObjectDirector } from "@/services/ObjectFormatter/FormattedObjectDirector";
import type { IObjectDecoder } from "@/services/ObjectDecoder";

const DELTA = 1;

export interface IObjectHandler {
  verify(links: string[]): Promise<VerifyObjectResponseType[] | Error>;
}

export class ObjectHandler implements IObjectHandler {
  private readonly diffPatcher: DiffPatcher = create();
  private readonly typeChecker = new TypeChecker();
  private readonly emptyChecker = new EmptyChecker();

  constructor(
    private readonly signService: ISignService,
    private readonly objectFormatter: IFormattedObjectDirector,
    private readonly objectDecoder: IObjectDecoder,
    private readonly logger: ILogger
  ) {}

  async verify(links: string[]): Promise<VerifyObjectResponseType[]> {
    this.validateLinks(links);

    const objects: Record<any, any>[] = await this.getObjectsData(links);
    const signsList: { id: string; document: DocumentType }[] = this.getSignsList(objects);

    if (this.emptyChecker.isEmptyArray(signsList)) {
      throw new EdsError(errorMessages.objectNoSign);
    }

    return Promise.all(
      signsList.map(async ({ id, document }: VerifyDocumentType) => {
        const object = objects.find((obj: Record<any, any>) => obj.id === id) || {};
        const response = await axios.get(document.url, { responseType: "blob" });
        const signEncoded = await BlobHandler.toBase64(response.data);
        const signPrepared = await this.signService.verify(signEncoded);
        const signData = this.objectDecoder.decode(signPrepared.data);

        const data = {
          fromSign: this.objectFormatter.build(signData.data || signData), // signData may contain "data" field
          fromDb: this.objectFormatter.build(object),
        };

        return {
          difference: this.diffPatcher.diff(data.fromSign, data.fromDb),
          signers: signPrepared.signers,
          data,
        };
      })
    );
  }

  private validateLinks(links: string[]): void {
    if (this.typeChecker.isUndefined(links) || !links.every(link => this.emptyChecker.isNotEmptyString(link))) {
      throw new EdsError(errorMessages.verifyLinks);
    }
  }

  private getDocumentsByType(documents: DocumentType[] | undefined, fileTypes: FileType[]): DocumentType[] {
    if (this.typeChecker.isUndefined(documents)) {
      return [];
    }

    return (documents as DocumentType[]).filter((document: DocumentType) =>
      fileTypes.some((type: Record<string, string>) =>
        Object.keys(type).every((key: string) => type[key] === document[key])
      )
    );
  }

  private getSignsList(objects: Record<any, any>[]): VerifyDocumentType[] {
    return objects
      .map((object: Record<any, any>, index: number) => {
        const documents: DocumentType[] = this.getDocumentsByType(object.documents, DOCUMENTS_SIGN);

        if (this.emptyChecker.isEmptyArray(documents)) {
          this.logger.error(`Sign is not present in #${index + 1} object. Skip checking sign`);
        }

        return {
          id: object.id,
          document: documents[documents.length - DELTA],
        };
      })
      .filter(({ document }: { document: DocumentType | undefined }) => Boolean(document));
  }

  private async getObject(url: string): Promise<Record<any, any>> {
    const result = await axios.get(url);
    const { data } = result.data;
    return data;
  }

  private async getObjectsData(links: string[]): Promise<Record<any, any>[]> {
    try {
      return await Promise.all(links.map(async url => this.getObject(url)));
    } catch (e: any) {
      throw new EdsError(errorMessages.objectAccess, e);
    }
  }
}
