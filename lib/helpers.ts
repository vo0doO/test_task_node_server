import { IBills } from "../app/models/bills";


export class mockIBills implements IBills {
    idBills: number;
    billsCount: number;
    billsAmount: number;
    billsPaidCount: number;
    billsPaindAmount: number;
    billsAddTimestamp: Date;
    constructor(id: number, count: number, amount: number, paidCount: number, paidAmount: number, ts: Date) {
        this.idBills = id;
        this.billsCount = count;
        this.billsAmount = amount;
        this.billsPaidCount = paidCount;
        this.billsPaindAmount = paidAmount;
        this.billsAddTimestamp = ts;
    }
}

export class CheckObj {

    obj: Object;
    objName: string;

    constructor(obj: Object, objName: string) {
        this.obj = obj;
        this.objName = objName;
    }
    // проверка свойств
    listProps = () => {

        const result = new Map();
        const keys = [];
        const vals = [];
        const valsT = [];

        for (let i in this.obj) {
            if (this.obj.hasOwnProperty(i))
                result.set(`${this.objName}.${i}`, `${this.obj[i]}`)
        }

        // Выделение ключа
        for (let k of result)
            keys.push(...[`${k[0]}`])
        // Выделение значения
        for (let k of result)
            vals.push(...[`${k[1]}`])
        // Выведение типов
        for (let k of result)
            valsT.push(...[typeof this.obj[`${k[0]}`]])

        return [keys, vals, valsT]
    }
}