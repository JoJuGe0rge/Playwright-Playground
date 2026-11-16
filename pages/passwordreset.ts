import type { Page } from '@playwright/test';

  class PasswordResetPage {
    constructor(private page: Page) {}
    async fillPasswordResetForm(newPassword: string, confirmPassword: string, securityAnswer: string) {     
      await this.page.getByRole('textbox', { name: '* New Password' }).fill(newPassword);
      await this.page.getByRole('textbox', { name: '* Confirm New Password' }).fill(confirmPassword);
      await this.page.getByRole('textbox', { name: '* New Answer' }).fill(securityAnswer);
      await this.page.getByRole('button', { name: 'Change Password' }).click();
    }
  };
  export default PasswordResetPage;
