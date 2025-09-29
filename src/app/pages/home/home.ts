import { Component, OnInit, signal } from '@angular/core';
import { UserDetails } from '../../models/user.model';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  userDetails = signal<UserDetails | null>(null);

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => {
        this.userDetails.set(data);
      },
      error: (err) => {
        console.error('Error loading user', err)
      }
    });
  }

  startGame(): void {
    this.router.navigateByUrl('/game-component');
  }
}