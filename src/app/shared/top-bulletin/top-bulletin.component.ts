import { Component } from '@angular/core';
import { assetsUrl } from 'src/app/constants/constants';
import { Bulletin } from 'src/app/models/bulletin.model';

@Component({
  selector: 'app-top-bulletin',
  templateUrl: './top-bulletin.component.html',
  styleUrls: ['./top-bulletin.component.scss']
})
export class TopBulletinComponent {
  readonly menuIcon = assetsUrl + 'menu_bullet.svg'
  readonly arrowDropdown = assetsUrl + 'arrow_right_dropdown.svg'

  bulletinList: Bulletin[] = [
    {
      date: new Date(),
      isRead: false,
      message: 'the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog the quick brown fox jumps over a lazy dog ',
      title: 'bulletin title'
    },
    {
      date: new Date(),
      isRead: true,
      message: 'insert message here',
      title: 'bulletin title (read)'
    },
  ]
}
