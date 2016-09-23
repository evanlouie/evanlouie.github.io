"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractEulerProblem_1 = require("./AbstractEulerProblem");
var EulerProblem1 = (function (_super) {
    __extends(EulerProblem1, _super);
    function EulerProblem1() {
        _super.apply(this, arguments);
        this.problemNumber = 1;
        this.question = "\n  If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.\n\n  Find the sum of all the multiples of 3 or 5 below 1000.";
    }
    EulerProblem1.prototype.isMultipleOf3or5 = function (n) {
        return n % 3 === 0 || n % 5 === 0;
    };
    EulerProblem1.prototype.answer = function () {
        var sum = 0;
        for (var n = 0; n < 1000; n++) {
            if (this.isMultipleOf3or5(n)) {
                sum += n;
            }
        }
        return sum.toString();
    };
    return EulerProblem1;
}(AbstractEulerProblem_1.AbstractEulerProblem));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EulerProblem1;
