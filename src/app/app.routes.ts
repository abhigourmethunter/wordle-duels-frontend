import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GameComponent } from './pages/game-component/game-component';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'game-component',
        component: GameComponent
    }
];
