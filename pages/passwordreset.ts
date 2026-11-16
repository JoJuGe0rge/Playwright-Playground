import type { Page,Locator } from '@playwright/test';

  class PasswordResetPage {
    page: Page;
    newPassword: Locator;
    confirmPassword: Locator;
    securityAnswer: Locator;
    changePasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newPassword = page.getByRole('textbox', { name: '* New Password' });
        this.confirmPassword = page.getByRole('textbox', { name: '* Confirm New Password' });
        this.securityAnswer = page.getByRole('textbox', { name: '* New Answer' });
        this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });
    }

    // async generatePassword(): Promise<string> {
    //   const length = 8;
    //   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    //   let password = ''; 
    //   for (let i = 0; i < length; i++) {
    //     password += charset.charAt(Math.floor(Math.random() * charset.length));
    //   }
    //   return password;  
    // } 


    async fillPasswordResetForm(user: string | undefined, newPassword: string, confirmPassword: string, securityAnswer: string) {     
      if (await this.newPassword.count() > 0) {
        // newPassword=confirmPassword= await this.generatePassword();
        await this.newPassword.fill(newPassword);
        await this.confirmPassword.fill(confirmPassword);
        await this.securityAnswer.fill(securityAnswer);
        await this.changePasswordButton.click();
      }
    }
  };
  export default PasswordResetPage;
