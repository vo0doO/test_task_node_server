import { bills } from "./helpers";

const dataGenerator = {

    *[Symbol.iterator]() {
        for (const index in bills) {
            if (index) {
                yield bills[index].billsAddTimestamp;
            }
        }
    }
};

export { dataGenerator }