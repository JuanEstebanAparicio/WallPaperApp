import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
email: string = '';
password: string = '';
  constructor(private auth: AuthService, private router: Router) { }
  
  ngOnInit() {
  }

  async onRegister() {
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err) {
      console.error(err);
    }
  }
}



