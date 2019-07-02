import { assert } from 'chai';

function isValidDate(s) {
    const bits = s.split('-');
    let d = new Date(bits[0], bits[1] - 1, bits[2]);
    return d && (d.getMonth() + 1) == bits[1];
}

export function assertIsValidateDate(allBillsAddTimestamp: string[]) {
    for (let ts of allBillsAddTimestamp) {
        let d = ts.split('T')[0]
        return assert.isOk(isValidDate(d))
    }
}