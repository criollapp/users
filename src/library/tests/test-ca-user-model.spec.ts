import {CAObjectUtil} from '@criollapp/common';

import { CAUser } from "../models/ca-user.model";

describe('CAUser', ()=> {
  let model:CAUser = new CAUser();

  it('must be extends CAModelAbstract', ()=>{
    expect(model.id < 0).toBeTruthy();
  });

  it('properties must have CAJson decorator',()=>{
    expect(CAObjectUtil.objectHasProperties( model.getJsonObject(), ['active','username','password'] ) ).toBeTruthy();
  });
});
