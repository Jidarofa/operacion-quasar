'use stricts'
//\"./{,!(node_modules)/**/}*.test.js\"

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const should = require('should');
const assert = require('assert');
var atob = require('atob');
var btoa = require('btoa');
chai.use(chaiHttp);
chai.use(require('chai-json-schema'));


describe("Operacion fuego de Quasar", () => {

    let urlQuasar;
    let topsecretSchema;
    let sKenobi;

    before(() => {
        urlQuasar = "https://quasar-qa-challenge.prodeng-playground.mercadolibre.com";
        topsecretSchema = {
            "position": {
                "x": 'number',
                "y": 'number'
            },
            "message": 'string'
        }
        sKenobi = 'Kenobi'
      });

      after (function after_login(){
        urlQuasar = undefined
   })

		it("Request /topsecret valido",  (done) => {    

            chai.request(urlQuasar)
				.post('/topsecret')
                .send({
                    "satellites": [
                            {
                                "name": "kenobi",
                                "distance": 100.0,
                                "message": ["este", "", "", "mensaje", ""]
                            },                   
                            {
                                "name": "skywalker",
                                "distance": 115.5,
                                "message": ["", "es", "", "", "secreto"]
                            },
                            {
                                "name": "sato",
                                "distance": 142.7,
                                "message": ["este", "", "un", "", ""]
                            }
                        ]
                    })               			
				.end((err, res) => {
                        let parse = JSON.parse(res.text)
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.jsonSchema(topsecretSchema);
                        expect(parse).to.have.property('position')
                        expect(parse).to.have.property('message')
                        expect(parse.position).to.have.property('x')
                        expect(parse.position).to.have.property('y')
                        expect(parse.position.x).to.be.a('number')
                        expect(parse.position.y).to.be.a('number')
                        expect(parse.message).to.be.a('string')
                        expect(parse.position.x).to.equal(301.39246);
                        expect(parse.position.y).to.equal(1731.018);
                        done();                
				});
		});

        it("Request /topsecret NoValido",  (done) => {    

            chai.request(urlQuasar)
				.post('/topsecret')
                .send({
                    "satellites": [
                            {
                                "name": "kenobi",
                                "distance": "100.0",
                                "message": ["este", "", "", "mensaje", ""]
                            },                   
                            {
                                "name": "skywalker",
                                "distance": "115.5",
                                "message": ["", "es", "", "", "secreto"]
                            },
                            {
                                "name": "sato",
                                "distance": "142.7",
                                "message": ["este", "", "un", "", ""]
                            }
                        ]
                    })               			
				.end((err, res) => {
                        expect(err).to.have.status(404)
                        done();                
				});
		});

        it("Request /topsecret_split/{satellite_name} valido",  (done) => {    

            chai.request(urlQuasar)
				.post('/topsecret_split/'+sKenobi)
                .send(
                            {
                                "distance": 100.0,
                                "message": ["este", "", "", "mensaje", ""]
                            }
                    )               			
				.end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.a('Array')
                        expect(res.text).to.equal('["Información guardada correctamente para '+sKenobi+'"]');
                        done();                
				});
		});

        it("Request /topsecret_split/{satellite_name} Novalido",  (done) => {    

            chai.request(urlQuasar)
				.post('/topsecret_split/'+sKenobi)
                .send(
                            {
                                "distance": "100.0",
                                "message": ["este", "", "", "mensaje", ""]
                            }
                    )               			
				.end((err, res) => {
                        expect(err).to.have.status(400)
                        done();                
				});
		});

});