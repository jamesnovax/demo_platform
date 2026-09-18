import { Routes } from '@angular/router';
import { Splash } from './pages/splash/splash';
import { Welcome } from './pages/welcome/welcome';
import { Dashboard } from './pages/dashboard/dashboard';
import { Projects } from './pages/projects/projects';
import { Members } from './pages/members/members';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: Splash },
  { path: 'welcome', component: Welcome },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: Projects },
  { path: 'projects/:id', component: Projects },
  { path: 'members', component: Members },
  { path: '**', redirectTo: 'splash' },
];
