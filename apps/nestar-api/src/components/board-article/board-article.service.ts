import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import { AllBoardArticlesInquiry, BoardArticleInput, BoardArticlesInquiry } from '../../libs/dto/board-article/board-article.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { lookUpMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class BoardArticleService {
    constructor(
        @InjectModel("BoardArticle") private boardArticleModel: Model<BoardArticle>,
        private memberService: MemberService,
        private viewService: ViewService
    ) { }

    public async createBoardArticle(memberId: ObjectId, input: BoardArticleInput): Promise<BoardArticle> {
        input.memberId = memberId
        try {
            const result = await this.boardArticleModel.create(input)
            await this.memberService.memberStatsEditor(
                {
                    _id: memberId,
                    targetKey: "memberArticles",
                    modifier: 1
                }
            )
            return result
        } catch (err: any) {
            console.log(`Error, Service.model:`, err.message)
            throw new BadRequestException(Message.CREATE_FAILED)
        }
    }

    public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> {
        const search: T = {
            _id: articleId,
            articleStatus: BoardArticleStatus.ACTIVE
        }

        const targetBoardArticle: BoardArticle = await this.boardArticleModel.findOne(search).lean().exec()
        if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
        if (memberId) {
            const viewInput = { memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE }
            const neView = await this.viewService.recordView(viewInput);
            if (neView) {
                await this.boardArticleStatsEditor({ _id: articleId, targetKey: "articleViews", modifier: 1 })
                targetBoardArticle.articleViews++
            }

            //meLiked
        }
        targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId)
        return targetBoardArticle
    }

    public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
        const { _id, articleStatus } = input
        const result = await this.boardArticleModel.findOneAndUpdate(
            { _id, memberId, articleStatus: BoardArticleStatus.ACTIVE }, input, { new: true }
        ).exec()

        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED)

        if (articleStatus === BoardArticleStatus.DELETE) {
            await this.memberService.memberStatsEditor(
                {
                    _id: memberId,
                    targetKey: "memberArticles",
                    modifier: -1
                }
            )
        }
        return result
    }

    public async getBoardArticles(memberId: ObjectId, input: BoardArticlesInquiry): Promise<BoardArticles> {
        const { articleCategory, text } = input.search
        const match: T = { articleStatus: BoardArticleStatus.ACTIVE }
        const sort: T = { [input?.sort ?? "createdAt"]: input.direction ?? Direction.DESC }

        if (articleCategory) match.articleCategory = articleCategory
        if (text) match.articleTitle = { $regex: new RegExp(text, "i") }
        if (input.search?.memberId) {
            match.memberId = shapeIntoMongoObjectId(input.search.memberId)
        }

        console.log("match", match)

        const result = await this.boardArticleModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        {
                            $skip: (input.page - 1) * input.limit
                        },
                        { $limit: input.limit },
                        //meLiked
                        lookUpMember,
                        { $unwind: "$memberData" }
                    ],
                    metaCounter: [{ $count: "total" }]
                }
            }
        ]).exec()
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

        return result[0]
    }

    /** ADMIN **/
    public async getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): Promise<BoardArticles> {
        const { articleCategory, articleStatus } = input.search
        const match: T = {}
        const sort: T = {
            [input?.sort ?? "createdAt"]: input.direction ?? Direction.DESC
        }

        if (articleCategory) match.articleCategory = articleCategory
        if (articleStatus) match.articleStatus = articleStatus

        const result = await this.boardArticleModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        {
                            $skip: (input.page - 1) * input.limit
                        },
                        { $limit: input.limit },
                        //meLiked
                        lookUpMember,
                        { $unwind: "$memberData" }
                    ],
                    metaCounter: [{ $count: "total" }]
                }
            }
        ])

        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

        return result[0]
    }

    public async updateBoardArticleByAdmin(input: BoardArticleUpdate): Promise<BoardArticle> {
        const { _id, articleStatus } = input;

        const result = await this.boardArticleModel.findOneAndUpdate(
            {
                _id: input._id,
                articleStatus: BoardArticleStatus.ACTIVE
            },
            input,
            { new: true }
        ).exec()

        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED)

        if (articleStatus === BoardArticleStatus.DELETE) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: "memberArticles",
                modifier: -1
            })
        }
        return result
    }

    public async removeBoardArticleByAdmin(articleId: ObjectId): Promise<BoardArticle> {
        const search: T = {
            _id: articleId,
            articleStatus: BoardArticleStatus.DELETE
        }
        const result = await this.boardArticleModel.findOneAndDelete(
            search
        ).exec()
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
        return result
    }

    public async boardArticleStatsEditor(input: StatisticModifier): Promise<BoardArticle> {
        const result = await this.boardArticleModel.findOneAndUpdate(
            {
                _id: input._id
            },
            { $inc: { [input.targetKey]: input.modifier } },
            { new: true }
        )
        return result
    }
}
