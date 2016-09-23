"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractEulerProblem_1 = require("./AbstractEulerProblem");
var EulerProblem3 = (function (_super) {
    __extends(EulerProblem3, _super);
    function EulerProblem3() {
        _super.apply(this, arguments);
        this.problemNumber = 3;
        this.question = "\n  The prime factors of 13195 are 5, 7, 13 and 29.\n\n  What is the largest prime factor of the number 600851475143 ?";
    }
    EulerProblem3.prototype.isPrime = function (n) {
        var start = 2;
        while (start <= Math.sqrt(n)) {
            if (n % start++ < 1) {
                return false;
            }
        }
        return n > 1;
    };
    EulerProblem3.prototype.answer = function () {
        var largestPrime = 3;
        for (var n = 600851475143; n > 0; n--) {
            if (this.isPrime(n)) {
                largestPrime = n;
                break;
            }
        }
        return largestPrime.toString();
    };
    return EulerProblem3;
}(AbstractEulerProblem_1.AbstractEulerProblem));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EulerProblem3;
