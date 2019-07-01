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

// checkDate принимает массив дат, возвращает результаты проверки утвеждений
function checkDate(allBillsAddTimestamp: string[]) {
    // итерация по массиву с датами
    for (const d of allBillsAddTimestamp) {
        /**
         * В процессе каждой итерации сохраняем billsAddTimestamp в переменную d,
         * d педаем в конструктор Date, а полученный объект сохраняем в переменную checkingDate
         */
        let checkingDate = new Date(d)
        // если checkingDate существовует 
        if (checkingDate) {
            /**
             * Убедимся в том, что checkingDate НЕ ЯВЛЯЕТСЯ НЕ ДЕЙСТВИТЕЛЬНОЙ датой.
             * Это поможет избежать ложноположительных результатов теста
             * которые могут образоваться в результате восприятия методом instanceof недействительной даты 
             * как полноправного инстанца конструктора Date
             * 
             * Для этого создадим недействительную дату и проверим утвердение:
             * checkingDate и "не действительная дата" не равны.
             */
            let invalidDate = new Date("");
            assert.notEqual(checkingDate, invalidDate)
            /**
             * Зная что checkingDate это точно не не действительная дата
             * Теперь мы можем проверить утверждение: "Все checkingDate(значения ответа с ключем billsAddTimestamp) - это даты"
             * и быть уверенными в отсутствии в результатах теста ложноположительных результатов 
             */
            return assert.instanceOf(new Date(d), Date, "Все значения с ключем billsAddTimestamp это даты")
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
                    // сохранить даты в переменную
                    const allBillsAddTimestamp: string[] = [...genTimestamp];
                    assert.isArray(bills, "В ответ на запрос вернулся массив объектов js");
                    // убедится что в массиве только действительные даты
                    checkDate(allBillsAddTimestamp);
                    assert.equal(allBillsAddTimestamp[0], startDate,
                        "Первая дата в ответе равна первой дате в запросе");
                    assert.equal(allBillsAddTimestamp[allBillsAddTimestamp.length - 1], endDate,
                        "Последняя дата в ответе равна последней дате в запросе");
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});