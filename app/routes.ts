import * as config from 'config';
import * as Router from 'koa-router';
import { AuthController } from "./controllers/auth";
import { UsersController } from './controllers/users';
import { BillsController } from "./controllers/bills";
import { Context } from "koa";

const router = new Router();
const users = new UsersController();
const auth = new AuthController();
const bills = new BillsController();

const usersProtectedRoute = config.get('appConfig.apiPrefix') + 'users/';
const authPublicRoute = config.get('appConfig.publicApiPrefix') + 'auth/';
const healthcheckRoute = config.get('appConfig.publicApiPrefix') + 'healthcheck';
const billsProtectedRoute = config.get('appConfig.apiPrefix') + 'bills/';

router

    /**
     * @api {get} /api/public/healthcheck
     * @apiName healthcheck
     * @apiGroup healthcheck
     *
     * @apiDescription Всегда вернет 200, когда приложение запущено
     *
     * @apiSuccess {Number} result 1
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "result": 1
     *     }
     */
    .get(healthcheckRoute, (ctx: Context, next: () => void) => {
        ctx.body = 1;
        next();
    })
    /**
     * @api {post} /api/public/auth/login
     * @apiName login
     * @apiGroup Auth
     *
     * @apiDescription Авторизует пользователя. В ответ на запрос отдаст JWT-Токен.
     * Его необходимо указывать в заголовке Authorization.
     *
     * @apiParam {String} email Почта пользователя.
     * @apiParam {String} password Пароль пользователя.
     *
     * @apiSuccess {String} result jwtToken
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "result":
     *          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.dtxWM6MIcgoeMgH87tGvsNDY6cHWL6MGW4LeYvnm1JA"
     *     }
     */
    .post(authPublicRoute + 'login', auth.login)
    /**
     * @api {get} /api/users/items
     * @apiName getUsers
     * @apiGroup User
     *
     * @apiDescription Возвращает список пользователей
     *
     * * @apiHeader (Authorization) authorization Authorization value.
     * @apiHeaderExample Headers-Example:
     *   { "Authorization": "Bearer :jwtToken" }
     *
     * @apiSuccess {Array} result Массив созданных пользователей.
     */
    .get(usersProtectedRoute + 'items', users.getItems, bills.getItemsFilteredByDate)
    /**
     * @api {get} /api/users/item
     * @apiName getUser
     * @apiGroup User
     *
     * @apiDescription Возвращает пользователя по id
     *
     * @apiHeader (Authorization) authorization Authorization value.
     * @apiHeaderExample Headers-Example:
     *   { "Authorization": "Bearer :jwtToken" }
     *
     * @apiParam {Number} id Идентификатор пользователя.
     *
     * @apiSuccess {Object} result пользователь.
     */
    .get(usersProtectedRoute + 'item', users.getItem)
    /**
     * @api {get} /api/bills/items
     * @apiName getBills
     * @apiGroup Bills
     *
     * @apiDescription Возвращает записи о платежных транзакциях
     *
     * @apiHeader {Authorization} authorization Authorization value.
     * @apiHeaderExample Headers-Example:
     *   { "Authorization": "Bearer :jwtToken" }
     *
     * @apiSuccess {Array} result массив записей о платежных транзакциях
     */
    .get(billsProtectedRoute + 'items', bills.getItems)
    /**
     * @api {get} /api/bills/filteredbydate
     * @apiName getBillsFilteredByDate
     * @apiGroup Bills
     *
     * @apiDescription Возвращает записи о платежных транзакциях отфильтрованые по диапозону дат
     *
     * @apiHeader (Authorization) authorization Authorization value.
     * @apiHeaderExample Headers-Example:
     *   { "Authorization": "Bearer :jwtToken" }
     *
     * @apiParam {Date} dateFrom дата начала диапазона по которому фильтруются записи
     * @apiParam {Date} dateTo дата окончания диапазона дат по которому фильтруются записи
     *
     * @apiSuccess {Array} result отфильтрованный массив записей о платёжных транзакциях
     */
    .get(billsProtectedRoute + 'items/filteredbydate', bills.getItemsFilteredByDate);

export { router };