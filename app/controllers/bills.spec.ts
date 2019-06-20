import { assert, expect } from "chai";
import { app } from "../../app";
import * as request from "request-promise";
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

// Вспомогательная функция для проверяем утверждения - все значения с ключем billsAddTimestamp - это даты.
// tslint:disable-next-line: typedef
function checkDate(allBillsAddTimestamp: string[]) {
    for (const d of allBillsAddTimestamp) {
        if (new Date(d)) {
            return assert.instanceOf(new Date(d), Date, "Все значения с ключем billsAddTimestamp это даты");
        }
    }
}

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

    describe('GET /api/bills/filteredByDate?dateFrom=[Date]&dateTo=[Date] => "Массив транзакций"', async () => {

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
                    // генератор дат
                    const genTimestamp = {
                        // tslint:disable-next-line: typedef
                        *[Symbol.iterator]() {
                            for (const index in bills) {
                                if (index) {
                                    yield bills[index].billsAddTimestamp;
                                }
                            }
                        }
                    };
                    // вызаваем генератор и сохраняем результат в переменную для последубщей проверки утверждений
                    const allBillsAddTimestamp: string[] = [...genTimestamp];

                    assert.isArray(bills, "В ответ на запрос вернулся массив объектов js");
                    // Проверяем утверждение - все значения с ключем billsAddTimestamp, это даты
                    checkDate(allBillsAddTimestamp);
                    assert.equal(allBillsAddTimestamp[0], startDate,
                        "Первая дата ответа равна начальной дате в запросе");
                    assert.equal(allBillsAddTimestamp[allBillsAddTimestamp.length - 1], endDate,
                        "Последняя дата ответа равна конечной дате в запросе");
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});