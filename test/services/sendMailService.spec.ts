import nodemailer from 'nodemailer';
import SendMailService from '../../src/services/sendMailService';

const sendMailService = new SendMailService();

describe('Test service sendmail', () => {
  it('Should get a expeption return if not send mail', async () => {
    try {
      await sendMailService.send('mail@email.com', 'html', 'title');
    } catch (error) {
      const e = error as Error;
      expect(e.message).toBe('Falha ao enviar email!');
    }
  });

  it('Should get a null return if send mail', async () => {
    nodemailer.createTransport = jest.fn().mockImplementationOnce(() => ({
      sendMail: () => Promise.resolve({}),
      close: () => Promise.resolve({}),
    }));

    const sendMailRespose = await sendMailService.send(
      'mail@email.com',
      'html',
      'title'
    );
    expect(sendMailRespose).toBeUndefined();
  });
});
