import * as chai from 'chai';
import { suite, test } from '../../node_modules/mocha';
import { mockIBills, Bills, CheckObj } from '../../lib/helpers'
import { IBills } from './bills';

const assert = chai.assert;
const Bills = new mockIBills(
    3333,
    937,
    839197.53,
    786,
    192237.06,
    new Date("2018-04-17 10:45:00+00")
);

const BillChecker = new CheckObj(Bills, 'Bills');
const [BillsKeys, BillsVals, BillsValsT] = BillChecker.listProps();
const mockChecker = new CheckObj(new mockIBills(), 'mockIBills');
const [mockKeys, mockVals, mockValsT] = mockChecker.listProps();

suite("Юнит тесты api платёжных транзакций", () => {

    suite("Проверяем что создается когда используется интерфейс IBills.", function () {

        test('Это не массив.', () => {
            assert.isNotArray(Bills)
        })

        test("Это не строка.", () => {
            assert.isNotString(Bills)
        })

        test("Это не номер.", () => {
            assert.isNotNumber(Bills)
        })

        test("Это не null.", () => {
            assert.isNotNull(Bills)
        })

        test("Это не функция.", () => {
            assert.isNotFunction(Bills)
        })

        test("Это не булево.", () => {
            assert.isNotBoolean(Bills)
        })

        test("Это не NaN.", () => {
            assert.isNotNumber(Bills)
        })

        test("Это не неопределено.", () => {
            assert.isDefined(Bills)
        })

        test("Это объект !", () => {
            assert.isObject(Bills)
        })

        test("Объект Javascript !", () => {
            assert.isString(JSON.stringify(Bills))
        })
    })

    suite("Смотрим глубже - проверяем свойства, устанавливаем идентичнось", () => {

        test("Это инстанц IBills.", () => {
            assert.instanceOf(Bills, mockIBills)
        })

        test("К сожалению не запечатан, к нему могут быть добавленны новые свойства, а текущие свойства могут быть удаленны !", () => {
            assert.isNotSealed(Bills)
        })

        test("Количество открытых свойств такое же, как у IBills.", () => {
            assert.equal(BillsKeys.length, mockKeys.length)
        })

        test("Тип каждого открытого свойства такой же, как у IBills", () => {
            for (let i in BillsValsT && mockValsT)
                assert.equal(BillsValsT[i], mockValsT[i])
        })
    })
})