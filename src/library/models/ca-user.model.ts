import { CAJson, CAModelAbstract } from '@criollapp/common';

export class CAUser extends CAModelAbstract
{
  @CAJson() public active:boolean;
  @CAJson() public username:boolean;
  @CAJson() public password:boolean;
}
