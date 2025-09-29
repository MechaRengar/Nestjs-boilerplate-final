import { Controller, Get } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { Auth } from 'decorators/http.decorators';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'decorators/auth-user.decorator';

@ApiTags('Plugins')
@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}
  
  @Get('get-list')
  @Auth()
  async getAllPluginsByAccountId(
    @AuthUser() user: any
  ) {
    const accountId = user?.accountId;
    return this.pluginService.getAllPlugins(accountId);
  }

}