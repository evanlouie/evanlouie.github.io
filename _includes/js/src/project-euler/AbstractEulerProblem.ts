interface ProjectEulerQuestion {
  problemNumber: number;
  question: string;
  answer(): string;
  printExecutionTime(): void;
}

export abstract class AbstractEulerProblem {
  public problemNumber = 0;
  public question = "";
  public abstract answer();

  // Default values
  private startTime = new Date().getTime();
  private endTime = this.startTime;

  public updateStartTime() {
    this.startTime = new Date().getTime();
  }

  public updateEndTime() {
    this.endTime = new Date().getTime();
  }

  public printExecutionTime() {
    this.updateEndTime();
    console.log(`=========`);
    console.info(`Question ${this.problemNumber}: ${this.question}`);
    console.log(`---------`);
    console.info(`  Answer to problem ${this.problemNumber}: ${this.answer()}`);
    console.info(`  Problem took ${this.endTime - this.startTime}ms to complete`);
  }
}
