import {pgService} from "../../app";

export interface IBills {
    idBills: bigint;
    billsCount: bigint;
    billsAmount: number;
    billsPaidCount: bigint;
    billsPaindAmount: bigint;
    billsAddTimestamp: string;
}

export class BillsModel {
    public async getItems(): Promise<Array<IBills>> {
        return await pgService.getRows(`SELECT * FROM public.aggr_bills`);
    }
}