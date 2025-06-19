
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminDocument } from '../schema/admin.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AdminDocument => {
    let request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    return request.user;
  },
);