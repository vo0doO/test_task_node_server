import { IBills } from "../app/models/bills";
import { assert } from "chai";

const startDate: string = "2018-04-01T00:05:00.000Z";
const endDate: string = "2018-04-02T00:00:00.000Z";
const host: string = "http://localhost";
const serverPort: number = 3322;
const billsResource: string = "/api/bills/items";
const billsResourceFilteredByDate: string = "/api/bills/filteredByDate";
const headersWithToken = {
    // tslint:disable-next-line: max-line-length
    "Authorization": 'Bearer eyJhbGciOiJIUzI1NiJ9.Y2FuZGlkYXRlQGUucnU.rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE',
    "accept": "application/json",
    'context-type': "application/json"
};

function makeRequestAddress(port: number, resource: string): string {
    return `${host}:${port}${resource}`;
}

export class MockIBills implements IBills {
    public idBills: number;
    public billsCount: number;
    public billsAmount: number;
    public billsPaidCount: number;
    public billsPaidAmount: number;
    public billsAddTimestamp: Date;
    constructor(id: number, count: number, amount: number, paidCount: number, paidAmount: number, ts: Date) {
        this.idBills = id;
        this.billsCount = count;
        this.billsAmount = amount;
        this.billsPaidCount = paidCount;
        this.billsPaidAmount = paidAmount;
        this.billsAddTimestamp = ts;
    }
}

var bills: IBills = {
    idBills: 3333,
    billsPaidCount: 9,
    billsPaidAmount: 10254,
    billsCount: 786,
    billsAmount: 1922,
    billsAddTimestamp: new Date("2018-04-17 10:45:00+00")
}

// tslint:disable-next-line: max-classes-per-file
export class CheckObj {

    public obj: object;
    public objName: string;
    public bills: IBills;

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

        // ключи
        for (const k of result) {
            keys.push(...[`${k[0]}`]);
        }
        // значения
        for (const k of result) {
            vals.push(...[`${k[1]}`]);
        }
        // типы значений
        for (const k of result) {
            valsT.push(...[typeof this.obj[`${k[0]}`]]);
        }

        return [keys, vals, valsT];
    }
}

const billChecker = new CheckObj(bills, 'bills');

const [billsKeys, billsVals, billsValsT] = billChecker.listProps();

const mockChecker = new CheckObj(new MockIBills(1, 1, 1, 1, 1, new Date("2019-05-06")), 'mockIBills');

const [mockKeys, mockVals, mockValsT] = mockChecker.listProps();

export {
    bills, billsKeys, billsValsT, mockKeys, mockValsT, host, serverPort, billsResource,
    headersWithToken, billsResourceFilteredByDate, makeRequestAddress, startDate, endDate
};
