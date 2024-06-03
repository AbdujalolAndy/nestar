import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/nestar-api/src/libs/dto/member/member';
import { Property } from 'apps/nestar-api/src/libs/dto/property/property';
import { MemberStatus, MemberType } from 'apps/nestar-api/src/libs/enums/member.enum';
import { PropertyStatus } from 'apps/nestar-api/src/libs/enums/property.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel("Property") private readonly propertyModel: Model<Property>,
    @InjectModel("Member") private readonly memberModel: Model<Member>
  ) { }
  public async batchRollBack(): Promise<void> {
    await this.propertyModel.updateMany(
      { propertyStatus: PropertyStatus.ACTIVE },
      { propertyRank: 0 }
    ).exec()

    await this.memberModel.updateMany(
      {
        memberStatus: MemberStatus.ACTIVE,
        memberType: MemberType.AGENT
      },
      { memberRank: 0 }
    ).exec();
  }
  public async batchProperties(): Promise<void> {
    const properties: Property[] = await this.propertyModel.find({
      propertyStatus: PropertyStatus.ACTIVE,
      propertyRank: 0
    }).exec()

    const promisedList = properties.map(async (property: Property) => {
      const { _id, propertyLikes, propertyViews } = property;
      const rank = propertyLikes * 2 + propertyViews * 1
      return await this.propertyModel.findOneAndUpdate(_id, { propertyRank: rank })
    })
    await Promise.all(promisedList)
  }
  public async batchAgents(): Promise<void> {
    const agents: Member[] = await this.memberModel.find({
      memberType: MemberType.AGENT,
      memberStatus: MemberStatus.ACTIVE,
      memberRank: 0
    }).exec()

    const promisedList = agents.map(async (agent: Member) => {
      const { _id, memberLikes, memberViews, memberArticles, memberProperties } = agent;
      const rank = memberProperties * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1
      return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank })
    })
    await Promise.all(promisedList)
  }


  getHello(): string {
    return 'Welcome to NESTAR batch serve!';
  }
}
