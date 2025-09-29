import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register {

  userName: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = ''
  email: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const payload = {
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };

    this.http.post(environment.apiUrl + '/auth/register', payload)
      .subscribe({
        next: (res: any) => {
          alert(res.response);
          if (res.registered) {
            this.router.navigateByUrl('/login');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert("Login failed: " + (err.error?.message || 'Unknown error'));
        }
      });
  }

  goToLogin() {
    this.router.navigateByUrl('/login')
  }
}