import { Injectable } from '@nestjs/common';
import MemberSchema from '../../schemas/Member.model';

@Injectable()
export class MemberService {
    public async signup(): Promise<string> {
        return "signup executed!"
    }
    public async login(): Promise<string> {
        return "login executed!"
    }
    public async updateMember(): Promise<string> {
        return "updateMember executed!"
    }
    public async getMember(): Promise<string> {
        return "getMember executed!"
    }
}
