import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class Login {

  userName: string = '';
  password: string = '';

  onSubmit() {
    const payload = {
      userName: this.userName,
      password: this.password
    };

    this.http.post(environment.apiUrl + '/api/auth/authenticate', payload)
      .subscribe({
        next: (res: any) => {
            if (res.token) {
            alert("Login Successful!");
            localStorage.setItem('authToken', res.token);
            this.router.navigateByUrl('/home');

          } else {
            alert("Unexpected response: " + JSON.stringify(res));
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert("Login failed: " + (err.error?.message || 'Unknown error'));
        }
      });
  }

  goToRegister() {
    this.router.navigateByUrl('/register')
  }

  constructor(private http: HttpClient, private router: Router) { }
}
