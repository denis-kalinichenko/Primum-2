import http from 'http';
import { expect } from 'chai';

import '../lib/index.js';

describe('Node Server', () => {
    it('should return 200', done => {
        http.get('http://127.0.0.1:1337', res => {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});