/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 26.08.2013
 * Time: 17:33
 */
/*global define:true*/
define(['chai', 'add'], function(chai, add) {
    var expect = chai.expect;
    describe('just checking', function() {

        it('works for add 1', function(done) {
            var test = add(1, 1);
            expect(test).equal(2);
            done();
        });

        it('works for add 10', function(done) {
            var test = add(1, 10);
            expect(test).equal(11);
            done();
        });

//        it('works for underscore', function() {
//            // just checking that _ works
//            expect(_.size([1,2,3])).toEqual(3);
//        });

    });

});