import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { fetchingPublic, fetchingPrivate } from '../core/config/axios.config';
import { RiderService } from '../rider/rider.service';
import { UserService } from '../user/user.service';
import { formatedNumberInCents } from '../libs/utils/formatedNumberInCents.utl';
import { createReference } from '../libs/utils/createReference.util';
import { createSignature } from '../libs/utils/createSignature.util';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(forwardRef(() => RiderService))
    private readonly riderService: RiderService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getAcceptanceToken(): Promise<string> {
    try {
      const response = await fetchingPublic(
        `/merchants/${process.env.PUBLIC_KEY_WOMPI}`,
      );
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error('Error al obtener el token de aceptación:', error.message);
      throw new Error('No se pudo obtener el token de aceptación.');
    }
  }

  async createPaymentSource(
    token: string,
    customer_email: string,
    acceptance_token: string,
  ) {
    try {
      const response = await fetchingPrivate.post('/payment_sources', {
        type: 'CARD',
        token,
        customer_email,
        acceptance_token,
      });
      return response.data.data.id;
    } catch (error) {
      throw new Error(
        JSON.stringify({
          status: error.response.status,
          ...error.response.data.error,
        }),
      );
    }
  }

  async savePaymentSource(token: string, customerEmail: string) {
    try {
      const user =
        await this.userService.getUserByEmailAndRoleRider(customerEmail);
      const acceptanceToken = await this.getAcceptanceToken();
      const idPaymentSource = await this.createPaymentSource(
        token,
        customerEmail,
        acceptanceToken,
      );
      const rider = await this.riderService.savePaymentSourceForUser(
        user,
        idPaymentSource,
      );
      return rider;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTransaction(
    amount_in_cents: number,
    customer_email: string,
    payment_source_id: number,
  ) {
    const reference = createReference();
    const amountFormated = formatedNumberInCents(amount_in_cents);
    const stringFormated = `${reference}${amountFormated}COP${process.env.INTEGRITY_KEY_WOMPI}`;
    const signature = await createSignature(stringFormated);
    const acceptanceToken = await this.getAcceptanceToken();
    try {
      const response = await fetchingPrivate.post('/transactions', {
        acceptance_token: acceptanceToken,
        amount_in_cents: amountFormated,
        currency: 'COP',
        signature,
        customer_email,
        payment_method: {
          installments: 1,
        },
        reference,
        payment_source_id,
      });
      return response;
    } catch (error) {
      throw new Error('No se pudo crear la transacción.');
    }
  }
}
