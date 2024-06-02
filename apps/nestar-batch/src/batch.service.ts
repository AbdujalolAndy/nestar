import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
  public async batchRollBack(): Promise<void> {
    console.log("batchRollBack")
  }
  public async batchProperties(): Promise<void> {
    console.log("batchProperties")
  }
  public async batchAgents(): Promise<void> {
    console.log("batchRollBack")
  }

  getHello(): string {
    return 'Welcome to NESTAR batch serve!';
  }
}
