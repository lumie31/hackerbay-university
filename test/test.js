const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

chai.should();
chai.use(chaiHttp);

describe("API Routes", () => {
  describe("GET /", () => {
    it("should return a 200 response", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("POST /data", () => {
    it("it should POST a data that returns a string", done => {
      chai
        .request(server)
        .post("/data")
        .send({ data: "dummy data" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("string");
          done();
        });
    });
  });

  describe("GET /data", () => {
    it("should return posted data", done => {
      chai
        .request(server)
        .get("/data")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("string");
          done();
        });
    });
  });
});
