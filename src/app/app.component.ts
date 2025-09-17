import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);



  constructor() {}
  ngOnInit() {
      onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });

  }
}
