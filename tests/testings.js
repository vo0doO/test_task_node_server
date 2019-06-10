var chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);
var expect = require('chai').expect;
var addr = 'http://localhost:2211';

suite("Тестим роутинг", () => {
    test("Посещаем проверку здоровья", () => {
        chai
            .request(addr)
            .get("/api/public/healthcheck")
            .then((res) => {
                assertEqual(res.status === 4000)
        });
    });
    test("Красный логин - ловим 400 с неправильными данными", () => {
        chai.request(addr)
            .post('/api/public/auth/login')
            .send({"email": "vasya@e.ru", "password": "vasyan"})
            .then((res)=>{
                expect(res).to.have.status(400);
            }).catch((err)=>{
            throw err;
        })
    });
    test("Зеленый логин - ловим 200 с правильными данными", () => {
        chai.request(addr)
            .post('/api/public/auth/login')
            .send({ "email": "candidate@e.ru", "password": "candidate"})
            .then((res)=>{
                expect(res).to.have.status(200);
                expect(res).to.have.json("result", "eyJhbGciOiJIUzI1NiJ9.Y2FuZGlkYXRlQGUucnU.rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE");
            }).catch((err) => {
            throw err;
        });
    });
    test("Крассный bills - ловим 401 с неправильным токен", () => {
        chai.request(addr)
            .get('/api/bills/items')
            .set('Authorization', 'Bearer rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE')
            .then((res) => {
                expect(err).to.have.status(401)
            }).catch((err) => {
            throw err;
        });
    });
    test("Зеленый bills - ловим 200 и массив с JSON с правильным токен", () => {
        chai.request(addr)
            .get('/api/bills/items')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.Y2FuZGlkYXRlQGUucnU.rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE')
            .then((res) => {
                expect(res).to.have.status(200)
            }).catch((err) => {
            throw err;
        });
    });
    test("Крассный filtered bills - ловим 401 с неправильным токен", () => {
        chai.request(addr)
            .get('/api/bills/filteredbydate?dateFrom=2018-04-09&dateTo=2018-04-11')
            .set('Authorization', 'Bearer rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE')
            .then((res) => {
                expect(res).to.have.status(401);

            }).catch((err) => {
            throw err;
        });
    });
    test("Зеленый filtered bills - ловим 200 и массив данных с правильным токен", () => {
        chai.request(addr)
            .get('/api/bills/filteredbydate?dateFrom=2018-04-09&dateTo=2018-04-11')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.Y2FuZGlkYXRlQGUucnU.rh1zZyPIsL6BOJUrOdfQHP63E3HF4fVhwrL19QqtfEE')
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.array();
            }).catch((err) => {
            throw err;
        });
    });
});
