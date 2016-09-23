"use strict";
var AbstractEulerProblem = (function () {
    function AbstractEulerProblem() {
        this.problemNumber = 0;
        this.question = "";
        this.startTime = new Date().getTime();
        this.endTime = this.startTime;
    }
    AbstractEulerProblem.prototype.updateStartTime = function () {
        this.startTime = new Date().getTime();
    };
    AbstractEulerProblem.prototype.updateEndTime = function () {
        this.endTime = new Date().getTime();
    };
    AbstractEulerProblem.prototype.printExecutionTime = function () {
        this.updateEndTime();
        console.log("=========");
        console.info("Question " + this.problemNumber + ": " + this.question);
        console.log("---------");
        console.info("  Answer to problem " + this.problemNumber + ": " + this.answer());
        console.info("  Problem took " + (this.endTime - this.startTime) + "ms to complete");
    };
    return AbstractEulerProblem;
}());
exports.AbstractEulerProblem = AbstractEulerProblem;
