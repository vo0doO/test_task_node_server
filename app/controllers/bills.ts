import {Controller} from "innots";
import {Context} from 'koa';
import {BillsModel} from "../models/bills";

const billsMOdel = new BillsModel();

export class BillsController extends Controller {
    public getItems = async (ctx: Context): Promise<void> => {
        ctx.body = await billsMOdel.getItems();
    }
}