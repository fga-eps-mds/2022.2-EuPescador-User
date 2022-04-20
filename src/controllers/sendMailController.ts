import { sendMailService } from '../services/sendMailService'

export default class SendMailController {
  async sendMail() {
    try {
      await sendMailService('fellipe.eng.soft@gmail.com');
      console.log('E-mail enviado! Fim da operação no backend. . .');
    } catch (error) {
      console.log(error);
    }
  }
}