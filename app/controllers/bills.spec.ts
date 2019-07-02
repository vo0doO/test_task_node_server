import { assert, expect } from "chai";
import { app } from "../../app";
import * as request from "request-promise";
import { dataGenerator } from '../../lib/dateGenerator'
import { assertIsValidateDate } from "../../lib/dateValidator";

import {
    bills,
    serverPort,
    billsResource,
    headersWithToken,
    billsResourceFilteredByDate,
    makeRequestAddress,
    startDate,
    endDate
} from "../../lib/helpers";



describe("Интеграционные тесты точки api платёжных транзакций", async (): Promise<void> => {

    before(async () => { await app; });

    describe('GET /api/bills/items => "Массив транзакций"', async () => {

        it("Возвращает ошибку 401 при запросе без указания токена", async () => {
            let response: any;
            try {
                response = await request.get(makeRequestAddress(serverPort, billsResource));
            } catch (err) {
                response = err;
            }
            assert.equal(response.statusCode, 401);
        });

        it("Возвращает массив при запросе с токеном", async () => {
            await request.get(makeRequestAddress(serverPort, billsResource), {
                headers: headersWithToken
            })
                .then(async (response) => {
                    assert.isArray(JSON.parse(response), "response это массив объектов js");
                })
                .catch((err) => {
                    throw err;
                });
        });

        it('В возвращенном массиве больше 4000 объектов', async () => {
            await request.get(makeRequestAddress(serverPort, billsResource), {
                headers: headersWithToken
            })
                .then(async (response) => {
                    assert.isAbove(JSON.parse(response).length, 4000);
                })
                .catch((err) => {
                    throw err;
                });
        });

        it('Ключи объектов в возвращенном массиве идентичны IBills', async () => {
            await request.get(makeRequestAddress(serverPort, billsResource), {
                headers: headersWithToken
            })
                .then(async (response) => {
                    const billsResp = JSON.parse(response);
                    const bill = billsResp[1];
                    expect(bill).to.have.all.keys(bills);
                })
                .catch((err) => {
                    throw err;
                });
        });
    });

    describe('GET /api/bills/filteredByDate?dateFrom=[Date]&dateTo=[Date] => "Отфильтрованный по датам массив транзакций"', async () => {

        it("Результат - массив транзакций, отфильтрованн по указанным датам и отсортированн", async () => {

            await request.get(makeRequestAddress(serverPort, billsResourceFilteredByDate), {
                headers: headersWithToken,
                qs: {
                    dateFrom: startDate,
                    dateTo: endDate
                }
            })
                .then(async (response) => {
                    const bills = JSON.parse(response);
                    const allBillsAddTimestamp: string[] = [...dataGenerator]; // сохранить даты в переменную!
                    assert.isArray(bills, "В ответ на запрос вернулся массив объектов js");
                    assertIsValidateDate(allBillsAddTimestamp); // Все даты валидны
                    assert.equal(allBillsAddTimestamp[0], startDate,
                        "Первая дата в ответе равна первой дате в запросе");
                    assert.equal(allBillsAddTimestamp[allBillsAddTimestamp.length - 1], endDate,
                        "Последняя дата в ответе равна последней дате в запросе");
                    assert.isAtLeast(new Date(allBillsAddTimestamp[allBillsAddTimestamp.length - 1]).getTime(), new Date(allBillsAddTimestamp[0]).getTime(),
                        "Последняя дата в ответе больше или равна первой дате")
                    assert.isAtMost(new Date(allBillsAddTimestamp[0]).getTime(), new Date(allBillsAddTimestamp[allBillsAddTimestamp.length - 1]).getTime(),
                        "Первая дата в ответе меньше или равна последней дате")
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});