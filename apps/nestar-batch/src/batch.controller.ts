import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger("BatchController")
  constructor(
    private readonly batchService: BatchService
  ) { }

  @Timeout(1000)
  public async handleTimeout() {
    try {
      this.logger.debug("Batch Server ready!")
      this.logger.debug("executed");
      await this.batchRollBack()
    } catch (err: any) {
      this.logger.error(err)
    }
  }

  @Cron('00 * * * * *', { name: BATCH_ROLLBACK })
  public async batchRollBack() {
    try {
      this.logger["context"] = BATCH_ROLLBACK
      this.logger.debug("EXECUTED");
      await this.batchService.batchRollBack()
    } catch (err: any) {
      this.logger.error(err)
    }
  }

  @Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES })
  public async batchProperties() {
    try {
      this.logger["context"] = BATCH_TOP_PROPERTIES
      this.logger.debug("EXECUTED")
      await this.batchService.batchProperties()
    } catch (err: any) {
      this.logger.error(err)
    }
  }

  @Cron('40 * * * * *', { name: BATCH_TOP_AGENTS })
  public async batchAgents() {
    try {
      this.logger["context"] = BATCH_TOP_AGENTS
      this.logger.debug("EXECUTED")
      await this.batchService.batchAgents()
    } catch (err: any) {
      this.logger.error(err)
    }
  }

  /*
  @Interval(1000)
  public handleInterval() {
    this.logger.debug("INTERVAL TEST")
  }
  */

  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}
