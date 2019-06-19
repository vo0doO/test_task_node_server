import * as chai from 'chai';
import { suite, test } from '../../node_modules/mocha';
import { bills, MockIBills, CheckObj } from '../../lib/helpers';

const assert = chai.assert;

const billChecker = new CheckObj(bills, 'bills');

const [billsKeys, billsVals, billsValsT] = billChecker.listProps();

const mockChecker = new CheckObj(new MockIBills(1, 1, 1, 1, 1, new Date("2019-05-06")), 'mockIBills');

const [mockKeys, mockVals, mockValsT] = mockChecker.listProps();

suite("Юнит тесты api платёжных транзакций", () => {

    // tslint:disable-next-line: typedef
    suite("Проверяем что создается когда используется интерфейс IBills.", () => {

        test('Это не массив.', () => {
            assert.isNotArray(bills);
        });

        test("Это не строка.", () => {
            assert.isNotString(bills);
        });

        test("Это не номер.", () => {
            assert.isNotNumber(bills);
        });

        test("Это не null.", () => {
            assert.isNotNull(bills);
        });

        test("Это не функция.", () => {
            assert.isNotFunction(bills);
        });

        test("Это не булево.", () => {
            assert.isNotBoolean(bills);
        });

        test("Это не NaN.", () => {
            assert.isNotNumber(bills);
        });

        test("Это не неопределено.", () => {
            assert.isDefined(bills);
        });

        test("Это объект !", () => {
            assert.isObject(bills);
        });

        test("Объект Javascript !", () => {
            assert.isString(JSON.stringify(bills));
        });
    });

    suite("Смотрим глубже - проверяем свойства, устанавливаем идентичнось", () => {

        test("Объект инстанц IBills.", () => {
            assert.instanceOf(bills, MockIBills);
        });

        test("К объекту могут быть добавленны новые свойства, а текущие свойства могут быть удаленны.", () => {
            assert.isNotSealed(bills);
        });

        test("Кол-во свойств объекта идентично IBills.", () => {
            assert.equal(billsKeys.length, mockKeys.length);
        });

        test("Типы значений в свойствах объекта идентичны IBills", () => {
            for (const i in billsValsT && mockValsT) {
                if (billsValsT[i] && mockValsT[i]) {
                    assert.equal(billsValsT[i], mockValsT[i]);
                }
            }
        });
    });
});