import type { Page,Locator } from '@playwright/test';

  class PasswordResetPage {
    page: Page;
    newPassword: Locator;
    confirmPassword: Locator;
    securityAnswer: Locator;
    changePasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newPassword = page.getByRole('textbox', { name: '* New Password' });
        this.confirmPassword = page.getByRole('textbox', { name: '* Confirm New Password' });
        this.securityAnswer = page.getByRole('textbox', { name: '* New Answer' });
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
      
      const newPasswordPresent = await this.newPassword
        .waitFor({ state: 'visible', timeout: 15000 })
        .then(() => true)
        .catch(() => false);

      if (newPasswordPresent) {
        // newPassword=confirmPassword= await this.generatePassword();
        console.log('Field count:', await this.newPassword.count());
        await this.page.waitForTimeout(5000);
        await this.newPassword.pressSequentially(newPassword);
        await this.confirmPassword.pressSequentially(confirmPassword);
        if (await this.securityAnswer.count() > 0) {
          await this.securityAnswer.pressSequentially(securityAnswer);
        }
        await this.changePasswordButton.click();
      }
    }
  };
  export default PasswordResetPage;
