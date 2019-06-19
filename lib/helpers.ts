import { IBills } from "../app/models/bills";

export class MockIBills implements IBills {
    public idBills: number;
    public billsCount: number;
    public billsAmount: number;
    public billsPaidCount: number;
    public billsPaindAmount: number;
    public billsAddTimestamp: Date;
    constructor(id: number, count: number, amount: number, paidCount: number, paidAmount: number, ts: Date) {
        this.idBills = id;
        this.billsCount = count;
        this.billsAmount = amount;
        this.billsPaidCount = paidCount;
        this.billsPaindAmount = paidAmount;
        this.billsAddTimestamp = ts;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class CheckObj {
    public obj: object;
    public objName: string;

    constructor(obj: object, objName: string) {
        this.obj = obj;
        this.objName = objName;
    }
    // проверка свойств
    public listProps = () => {

        const result = new Map();
        const keys = [];
        const vals = [];
        const valsT = [];

        for (const i in this.obj) {
            if (this.obj.hasOwnProperty(i)) {
                result.set(`${this.objName}.${i}`, `${this.obj[i]}`);
            }
        }

        // Выделение ключа
        for (const k of result) {
            keys.push(...[`${k[0]}`]);
        }
        // Выделение значения
        for (const k of result) {
            vals.push(...[`${k[1]}`]);
        }
        // Выведение типов
        for (const k of result) {
            valsT.push(...[typeof this.obj[`${k[0]}`]]);
        }

        return [keys, vals, valsT];
    }
}