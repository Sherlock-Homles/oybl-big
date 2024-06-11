import { RightInfoService } from './rightInfo.service';
import { TitleService } from './title.service';
import { MapService } from './map.service';
import { StoryService } from './story.service';
import { UserService } from './user.service';

export default {
  mapService: new MapService(),
  rightInfoService: new RightInfoService(),
  titleService: new TitleService(),
  storyService: new StoryService(),
  userService: new UserService(),
};
